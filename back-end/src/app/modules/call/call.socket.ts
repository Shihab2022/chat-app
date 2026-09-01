import { Socket } from 'socket.io';
import config from '../../../app/config';
import { callServiceMessages, callStatus, callType } from '../../../constant';
import { CallServices } from './call.services';
import { CallType } from './call.interface';

/* ─────────────────────────────────────────────────────────────
 * WebRTC signaling + call lifecycle with automatic DB logging.
 *
 * Every attempt creates a `call_logs` row with status 'received'.
 * It then transitions to:
 *   - 'rejected'  when the callee taps Reject (or is busy)
 *   - 'missed'    when no one answers (ring timeout, socket drop)
 *   - 'completed' when both peers connected and the call is hung up
 * ───────────────────────────────────────────────────────────── */

// Env-tunable (CALL_RING_TIMEOUT_MS), clamped to a sane 5s minimum.
const RING_TIMEOUT_MS = Math.max(
  5_000,
  Number(config.call.ring_timeout_ms) || 30_000,
);

interface ActiveCall {
  callId: number;
  callerId: string;
  calleeId: string;
  callType: CallType;
  answered: boolean;
  timer: NodeJS.Timeout | null;
}

const activeCalls = new Map<number, ActiveCall>();

export interface CallSocketHelpers {
  emitToUser: (userId: string, event: string, payload: any) => void;
  isUserOnline: (userId: string) => boolean;
}

const clearRingTimer = (call: ActiveCall) => {
  if (call.timer) {
    clearTimeout(call.timer);
    call.timer = null;
  }
};

const hasActiveCallParticipant = (userId: string): boolean =>
  [...activeCalls.values()].some(
    (call) =>
      String(call.callerId) === String(userId) ||
      String(call.calleeId) === String(userId),
  );

/**
 * Marks a call with its final status, stamps end_time and computes
 * duration. SQL guard (`call_status = 'received'`) makes this
 * idempotent - a second call never overwrites the first outcome.
 */
const finalizeCall = async (
  callId: number,
  status: string,
  durationSeconds?: number | null,
) => {
  return CallServices.updateCallLog({
    callId,
    status: status as any,
    setEndTime: true,
    // null → server computes end_time - start_time in SQL.
    durationSeconds: durationSeconds ?? null,
  });
};

/** Relays an SDP / ICE payload only between the two call participants. */
const relayToParticipant = (
  userId: string,
  event: string,
  payload: any,
  helpers: CallSocketHelpers,
) => {
  const { callId, to } = payload || {};
  if (!callId || !to) return;
  const active = activeCalls.get(Number(callId));
  if (!active) return;
  const participants = [String(active.callerId), String(active.calleeId)];
  if (
    !participants.includes(String(userId)) ||
    !participants.includes(String(to))
  ) {
    return;
  }
  helpers.emitToUser(String(to), event, {
    ...payload,
    from: String(userId),
  });
};

/**
 * Register the call socket handlers for a connected client.
 * `helpers.emitToUser` keeps the module decoupled from socket.ts
 * (no circular imports).
 */
export function registerCallSocketHandlers(
  socket: Socket,
  userId: string,
  helpers: CallSocketHelpers,
) {
  const { emitToUser } = helpers;

  /* ── Caller initiates a call ─────────────────────────────── */
  socket.on('call:start', async (payload: any = {}) => {
    const { receiverId, callType: requestedType } = payload || {};
    const callerId = String(userId);

    if (!receiverId) {
      emitToUser(callerId, 'call:error', {
        message: callServiceMessages.RECEIVER_NOT_FOUND,
      });
      return;
    }
    if (![callType.AUDIO, callType.VIDEO].includes(requestedType)) {
      emitToUser(callerId, 'call:error', {
        message: callServiceMessages.INVALID_CALL_TYPE,
      });
      return;
    }
    if (hasActiveCallParticipant(callerId)) {
      emitToUser(callerId, 'call:error', {
        message: callServiceMessages.ALREADY_IN_CALL,
      });
      return;
    }

    try {
      const callerInfo = await CallServices.getPeerInfo(callerId);
      const receiverInfo = await CallServices.getPeerInfo(receiverId);

      // Receiver offline → log 'missed' immediately, no ring occurs.
      const receiverOnline = helpers.isUserOnline(String(receiverId));
      if (!receiverOnline) {
        const missedLog = await CallServices.createCallLog({
          callerId,
          receiverId,
          callType: requestedType,
        });
        await finalizeCall(Number(missedLog.id), callStatus.MISSED, 0);
        emitToUser(callerId, 'call:missed', {
          callId: missedLog.id,
          message: callServiceMessages.RECEIVER_OFFLINE,
          receiverName: receiverInfo.name,
        });
        return;
      }

      // Receiver is already in another call → busy-reject immediately.
      if (hasActiveCallParticipant(String(receiverId))) {
        const busyLog = await CallServices.createCallLog({
          callerId,
          receiverId,
          callType: requestedType,
        });
        await finalizeCall(Number(busyLog.id), callStatus.REJECTED, 0);
        emitToUser(callerId, 'call:rejected', {
          callId: busyLog.id,
          message: 'User is busy in another call',
        });
        return;
      }

      const log = await CallServices.createCallLog({
        callerId,
        receiverId,
        callType: requestedType,
      });
      const callId = Number(log.id);

      const active: ActiveCall = {
        callId,
        callerId,
        calleeId: String(receiverId),
        callType: requestedType,
        answered: false,
        timer: null,
      };

      // Ring timeout → 'missed' on the callee side, notify both peers.
      active.timer = setTimeout(async () => {
        const current = activeCalls.get(callId);
        if (!current || current.answered) return;
        clearRingTimer(current);
        activeCalls.delete(callId);
        await finalizeCall(callId, callStatus.MISSED, 0);
        emitToUser(callerId, 'call:missed', { callId });
        emitToUser(String(receiverId), 'call:timeout', { callId });
      }, RING_TIMEOUT_MS);

      activeCalls.set(callId, active);

      // Notify the callee (incoming call overlay) with caller identity.
      emitToUser(String(receiverId), 'call:incoming', {
        callId,
        caller: { id: callerId, name: callerInfo.name, img: callerInfo.img },
        callType: requestedType,
      });

      // Ack the caller so the outgoing overlay knows its callId.
      emitToUser(callerId, 'call:starting', {
        callId,
        receiverId: String(receiverId),
        callType: requestedType,
        receiver: {
          id: String(receiverId),
          name: receiverInfo.name,
          img: receiverInfo.img,
        },
      });
    } catch (error: any) {
      emitToUser(callerId, 'call:error', {
        message: error?.message || 'Unable to start call',
      });
    }
  });

  /* ── Callee accepts ──────────────────────────────────────── */
  socket.on('call:accept', async (payload: any = {}) => {
    const { callId } = payload || {};
    const active = activeCalls.get(Number(callId));
    if (!active || String(active.calleeId) !== String(userId)) return;

    active.answered = true;
    clearRingTimer(active);

    try {
      const calleeInfo = await CallServices.getPeerInfo(userId);
      emitToUser(active.callerId, 'call:accepted', {
        callId: active.callId,
        callType: active.callType,
        callee: {
          id: String(userId),
          name: calleeInfo.name,
          img: calleeInfo.img,
        },
      });
    } catch {
      emitToUser(active.callerId, 'call:error', {
        message: 'Unable to answer call',
      });
    }
  });

  /* ── Callee rejects ──────────────────────────────────────── */
  socket.on('call:reject', async (payload: any = {}) => {
    const { callId } = payload || {};
    const active = activeCalls.get(Number(callId));
    if (!active || String(active.calleeId) !== String(userId)) return;

    clearRingTimer(active);
    activeCalls.delete(active.callId);
    await finalizeCall(active.callId, callStatus.REJECTED, 0);
    emitToUser(active.callerId, 'call:rejected', { callId: active.callId });
  });

  /* ── Either participant hangs up ─────────────────────────── */
  socket.on('call:end', async (payload: any = {}) => {
    const { callId } = payload || {};
    const active = activeCalls.get(Number(callId));
    if (!active) return;
    const isParticipant =
      String(active.callerId) === String(userId) ||
      String(active.calleeId) === String(userId);
    if (!isParticipant) return;

    clearRingTimer(active);
    activeCalls.delete(active.callId);

    // Connected & hung up → completed. Canceled while ringing → missed.
    const status = active.answered ? callStatus.COMPLETED : callStatus.MISSED;
    // Prefer the hang-up client's accurate talk-time; fall back to
    // end_time - start_time computed in SQL. Unanswered attempts are 0.
    const clientDuration = Number(payload?.durationSeconds);
    const durationSeconds = !active.answered
      ? 0
      : Number.isFinite(clientDuration) && clientDuration > 0
        ? Math.round(clientDuration)
        : null;
    const log = await finalizeCall(active.callId, status, durationSeconds);
    const duration = Number(log?.duration_seconds) || 0;

    const peerId =
      String(active.callerId) === String(userId)
        ? active.calleeId
        : active.callerId;
    emitToUser(peerId, 'call:ended', {
      callId: active.callId,
      duration,
      endedBy: String(userId),
    });
    emitToUser(String(userId), 'call:ended', {
      callId: active.callId,
      duration,
      endedBy: String(userId),
    });
  });

  /* ── WebRTC signaling relays ─────────────────────────────── */
  socket.on('webrtc:offer', (payload) =>
    relayToParticipant(userId, 'webrtc:offer', payload, helpers),
  );
  socket.on('webrtc:answer', (payload) =>
    relayToParticipant(userId, 'webrtc:answer', payload, helpers),
  );
  socket.on('webrtc:ice-candidate', (payload) =>
    relayToParticipant(userId, 'webrtc:ice-candidate', payload, helpers),
  );
}

/**
 * Called from socket.ts when a socket disconnects. Finalizes any live
 * call the user was part of and notifies the other participant.
 */
export async function handleUserDisconnect(
  userId: string,
  helpers: CallSocketHelpers,
) {
  const { emitToUser } = helpers;
  const callIds = [...activeCalls.entries()]
    .filter(
      ([, call]) =>
        String(call.callerId) === String(userId) ||
        String(call.calleeId) === String(userId),
    )
    .map(([callId]) => callId);

  for (const callId of callIds) {
    const active = activeCalls.get(callId);
    if (!active) continue;
    clearRingTimer(active);
    activeCalls.delete(callId);

    const status = active.answered ? callStatus.COMPLETED : callStatus.MISSED;
    // The disconnecting client cannot report talk-time; let the server
    // derive it from end_time - start_time (answered) or pin it to 0.
    const log = await finalizeCall(callId, status, active.answered ? null : 0);
    const duration = Number(log?.duration_seconds) || 0;

    const peerId =
      String(active.callerId) === String(userId)
        ? active.calleeId
        : active.callerId;
    emitToUser(peerId, 'call:ended', {
      callId,
      duration,
      endedBy: String(userId),
    });
  }
}