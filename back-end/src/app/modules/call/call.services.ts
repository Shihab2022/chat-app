import { pool } from '../../../utils/pg';
import config from '../../../app/config';
import AppError from '../../error/appError';
import httpStatus from 'http-status';
import { callServiceMessages } from '../../../constant';
import { CallStatus, CallType, TCallLog, TCallPeerInfo } from './call.interface';

/* ─────────────────────────────────────────────────────────────
 * Row normalizers (keep snake_case DB rows but add camelCase
 * peers so the frontend can render identity right away).
 * ───────────────────────────────────────────────────────────── */
export const normalizeCallLog = (row: any): TCallLog | null => {
  if (!row) return null;
  return {
    id: row.id,
    caller_id: row.caller_id,
    receiver_id: row.receiver_id,
    call_type: row.call_type,
    call_status: row.call_status,
    start_time: row.start_time,
    end_time: row.end_time,
    duration_seconds: Number(row.duration_seconds) || 0,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
};

export const getPeerInfo = async (userId: number | string): Promise<TCallPeerInfo> => {
  const { rows } = await pool.query(
    `SELECT id, name, img FROM users WHERE id = $1 LIMIT 1`,
    [userId],
  );
  const row = rows[0];
  if (!row) {
    throw new AppError(httpStatus.NOT_FOUND, callServiceMessages.RECEIVER_NOT_FOUND);
  }
  return { id: String(row.id), name: row.name || 'Unknown', img: row.img || '' };
};

/**
 * Insert a call attempt with status 'received'. `start_time` records
 * the moment the attempt was made so completed duration = end - start.
 */
export const createCallLog = async ({
  callerId,
  receiverId,
  callType,
}: {
  callerId: number | string;
  receiverId: number | string;
  callType: CallType;
}): Promise<TCallLog> => {
  const { rows } = await pool.query(
    `INSERT INTO call_logs (caller_id, receiver_id, call_type, call_status, start_time)
     VALUES ($1, $2, $3, 'received', CURRENT_TIMESTAMP)
     RETURNING *`,
    [callerId, receiverId, callType],
  );
  const log = normalizeCallLog(rows[0]);
  if (!log) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to create call log');
  }
  return log;
};

/**
 * Transition an existing call. Only updates rows still in the
 * 'received' state so a double finalize can never overwrite a result.
 * When endTime is true the status is completed, end_time is stamped and
 * duration is computed in seconds.
 */
export const updateCallLog = async ({
  callId,
  status,
  setEndTime = false,
  durationSeconds,
}: {
  callId: number | string;
  status: CallStatus;
  setEndTime?: boolean;
  durationSeconds?: number | null;
}): Promise<TCallLog | null> => {
  if (setEndTime) {
    const { rows } = await pool.query(
      `UPDATE call_logs
         SET call_status = $2,
             end_time = CURRENT_TIMESTAMP,
             duration_seconds = COALESCE($3::int,
                 EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP
                   - COALESCE(start_time, CURRENT_TIMESTAMP)))::int),
             updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND call_status = 'received'
       RETURNING *`,
      [callId, status, durationSeconds ?? null],
    );
    return normalizeCallLog(rows[0]);
  }

  const { rows } = await pool.query(
    `UPDATE call_logs
       SET call_status = $2, updated_at = CURRENT_TIMESTAMP
     WHERE id = $1 AND call_status = 'received'
     RETURNING *`,
    [callId, status],
  );
  return normalizeCallLog(rows[0]);
};

export const getCallLogById = async (
  callId: number | string,
): Promise<TCallLog | null> => {
  const { rows } = await pool.query(
    `SELECT * FROM call_logs WHERE id = $1 LIMIT 1`,
    [callId],
  );
  return normalizeCallLog(rows[0]);
};

/**
 * Fetch call history for the current user (as caller or receiver).
 * Optional peerId narrows to a single conversation.
 */
export const getCallHistory = async ({
  currentUserId,
  peerId,
}: {
  currentUserId: number | string;
  peerId?: number | string;
}): Promise<any[]> => {
  const peerFilter = peerId
    ? `AND ((cl.caller_id = $2 AND cl.receiver_id = $1)
          OR (cl.caller_id = $1 AND cl.receiver_id = $2))`
    : '';

  // Env-tunable result cap (CALL_HISTORY_LIMIT), hard-clamped to 500.
  const limit = Math.min(
    Math.max(1, Number(config.call.history_limit) || 200),
    500,
  );

  const { rows } = await pool.query(
    `SELECT
        cl.*,
        caller.name AS caller_name,
        caller.img AS caller_img,
        receiver.name AS receiver_name,
        receiver.img AS receiver_img
      FROM call_logs cl
      JOIN users caller ON caller.id = cl.caller_id
      JOIN users receiver ON receiver.id = cl.receiver_id
      WHERE (cl.caller_id = $1 OR cl.receiver_id = $1)
        ${peerFilter}
      ORDER BY cl.created_at DESC
      LIMIT ${limit}`,
    peerId ? [currentUserId, peerId] : [currentUserId],
  );

  return rows.map((row: any) => ({
    ...normalizeCallLog(row),
    caller_name: row.caller_name,
    caller_img: row.caller_img,
    receiver_name: row.receiver_name,
    receiver_img: row.receiver_img,
  }));
};

export const CallServices = {
  createCallLog,
  updateCallLog,
  getCallLogById,
  getCallHistory,
  getPeerInfo,
};