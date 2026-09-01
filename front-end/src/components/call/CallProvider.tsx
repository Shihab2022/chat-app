/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  CALL_SOCKET_EVENTS,
  CALL_TYPE,
  CALL_RING_TIMEOUT_MS,
  STUN_SERVERS,
} from "../../constants/call";
import { getSocket } from "../../utils/socketService";
import { showToast } from "../../utils/toast";
import { FAILED, INFO, SUCCESS, WARNING } from "../../constants/common";
import { playCallEndedBeep, startRingtone, stopRingtone } from "../../utils/ringtone";
import { CallPeer, CallSummary, CallType } from "../../types/call";
import { TUser } from "../../types";
import {
  CLEAR_CALL_SUMMARY,
  RESET_CALL,
  SET_CALL_ACTIVE,
  SET_CALL_CONNECTING,
  SET_CALL_SUMMARY,
  SET_CAMERA,
  SET_INCOMING_CALL,
  SET_MIC,
  SET_OUTGOING_CALL,
  SET_PEER,
  SET_REMOTE_VIDEO_READY,
  SET_SCREEN_SHARE,
} from "../../redux/features/call/callSlice";

export interface CallContextValue {
  status: string;
  callType: CallType | null;
  peer: CallPeer | null;
  callId: number | string | null;
  isCameraOn: boolean;
  isMicOn: boolean;
  isScreenSharing: boolean;
  isRemoteVideoReady: boolean;
  connectedAt: number | null;
  error: string | null;
  summary: CallSummary | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  startAudioCall: (user: TUser | CallPeer) => void;
  startVideoCall: (user: TUser | CallPeer) => void;
  acceptCall: () => void;
  rejectCall: () => void;
  endCall: () => void;
  toggleCamera: () => void;
  toggleMic: () => void;
  toggleScreenShare: () => void;
  clearSummary: () => void;
}

const CallContext = createContext<CallContextValue | undefined>(undefined);

const formatDuration = (seconds: number): string => {
  const total = Math.max(0, Math.floor(seconds ?? 0));
  const minutes = Math.floor(total / 60);
  const rest = total % 60;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
};

const normalizePeer = (user: TUser | CallPeer): CallPeer => ({
  id: String(user?.id ?? ""),
  name: user?.name || "Unknown",
  img: user?.img || "",
});

export const CallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const callState = useSelector((state: RootState) => state.call);
  const { status, callType, peer, callId, isCameraOn, isMicOn, isScreenSharing, isRemoteVideoReady } =
    callState;

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const callIdRef = useRef<number | string | null>(null);
  const peerIdRef = useRef<string | null>(null);
  const isInitiatorRef = useRef<boolean>(false);
  const directionRef = useRef<"incoming" | "outgoing" | null>(null);
  const mediaStateRef = useRef({ micOn: true, camOn: true, sharing: false });
  const peerRef = useRef<CallPeer | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const attachedSocketRef = useRef<any>(null);
  const listenersRef = useRef<Array<[string, (...args: any[]) => void]>>([]);
  const incomingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Acquire camera/mic with human-friendly permission error handling.
   */
  const acquireMedia = async (callType: CallType): Promise<{ stream?: MediaStream; error?: string }> => {
    if (!navigator.mediaDevices?.getUserMedia) {
      return { error: "Camera/microphone access requires a secure HTTPS (or localhost) connection." };
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: callType === CALL_TYPE.VIDEO
          ? { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" }
          : false,
      });
      return { stream };
    } catch (err: any) {
      let message = "Unable to access camera or microphone. Please check your device settings.";
      if (err?.name === "NotAllowedError" || err?.name === "PermissionDeniedError") {
        message = "Camera/microphone access was denied. Please allow permissions in your browser and try again.";
      } else if (err?.name === "NotFoundError" || err?.name === "DevicesNotFoundError") {
        message = "No camera or microphone was found on this device.";
      } else if (err?.name === "NotReadableError") {
        message = "Your camera or microphone is already in use by another application.";
      } else if (err?.name === "SecurityError") {
        message = "Camera/microphone access is blocked by browser security settings.";
      } else if (err?.name === "OverconstrainedError") {
        message = "The requested camera/mic settings are not supported on this device.";
      }
      return { error: message };
    }
  };

  /* ── Peer connection + cleanup ──────────────────────────── */
  const cleanupMediaAndPeer = () => {
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    screenStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;
    screenStreamRef.current = null;
    setLocalStream(null);
    setRemoteStream(null);
    dispatch(SET_REMOTE_VIDEO_READY(false));

    if (pcRef.current) {
      pcRef.current.onicecandidate = null;
      pcRef.current.ontrack = null;
      pcRef.current.onconnectionstatechange = null;
      try {
        pcRef.current.close();
      } catch {
        // already closed
      }
      pcRef.current = null;
    }
    isInitiatorRef.current = false;
    callIdRef.current = null;
    peerIdRef.current = null;
    pendingCandidatesRef.current = [];
  };

  const createPeerConnection = (stream: MediaStream): RTCPeerConnection => {
    const pc = new RTCPeerConnection({ iceServers: STUN_SERVERS });
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    pc.onicecandidate = (event) => {
      if (event.candidate && callIdRef.current && peerIdRef.current) {




        getSocket()?.emit(CALL_SOCKET_EVENTS.RTC_ICE_CANDIDATE, {
          callId: callIdRef.current,
          to: peerIdRef.current,
          candidate: event.candidate.toJSON(),
        });
      }
    };

    pc.ontrack = (event) => {
      const incoming = event.streams[0] || new MediaStream([event.track]);
      setRemoteStream(incoming);
      if (event.track.kind === "video") {
        dispatch(SET_REMOTE_VIDEO_READY(true));
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "connected") {
        stopRingtone();
        dispatch(SET_CALL_ACTIVE());
      } else if (pc.connectionState === "failed") {
        handleCallEnded("ended", 0, "Call connection failed");
      }
    };

    return pc;
  };

  const handleCallEnded = (
    reason: CallSummary["reason"],
    durationSeconds: number,
    message?: string,
  ) => {
    stopRingtone();
    if (incomingTimerRef.current) {
      clearTimeout(incomingTimerRef.current);
      incomingTimerRef.current = null;
    }
    const peerName = peerRef.current?.name;
    cleanupMediaAndPeer();
    dispatch(RESET_CALL());
    dispatch(SET_CALL_SUMMARY({ reason, durationSeconds, peerName, message }));

    playCallEndedBeep();
    if (reason === "rejected") {
      showToast(WARNING, message || (peerName ? `Call rejected by ${peerName}` : "Call rejected"));
    } else if (reason === "missed") {
      showToast(INFO, message || (peerName ? `No answer from ${peerName}` : "Call missed"));
    } else if (reason === "unavailable") {
      showToast(FAILED, message || "User is offline right now");
    } else if (reason === "error") {
      showToast(FAILED, message || "Call failed. Please try again.");
    } else {
      showToast(SUCCESS, durationSeconds > 0 ? `Call ended · ${formatDuration(durationSeconds)}` : "Call ended");
    }
  };

  const applyMediaToTracks = (stream: MediaStream) => {
    stream.getAudioTracks().forEach((track) => {
      track.enabled = mediaStateRef.current.micOn;
    });
    stream.getVideoTracks().forEach((track) => {
      track.enabled = mediaStateRef.current.camOn;
    });
  };

  /* ── Public call actions ──────────────────────────────────── */
  const startCall = async (user: TUser | CallPeer, callType: CallType) => {
    const socket = getSocket();
    if (!socket?.connected) {
      showToast(FAILED, "You are offline. Please reconnect and try again.");
      return;
    }
    const target = normalizePeer(user);
    if (!target.id) return;

    const { stream, error } = await acquireMedia(callType);
    if (error) {
      showToast(FAILED, error);
      return;
    }
    if (!stream) return;

    localStreamRef.current = stream;
    setLocalStream(stream);
    mediaStateRef.current.micOn = true;
    mediaStateRef.current.camOn = callType === CALL_TYPE.VIDEO;




    mediaStateRef.current.sharing = false;
    applyMediaToTracks(stream);

    peerRef.current = target;
    peerIdRef.current = target.id;

    directionRef.current = "outgoing";
    isInitiatorRef.current = true;
    dispatch(SET_OUTGOING_CALL({ receiver: target, callType }));
    dispatch(SET_CAMERA(callType === CALL_TYPE.VIDEO));
    dispatch(SET_MIC(true));
    dispatch(SET_SCREEN_SHARE(false));
    startRingtone();
    socket.emit(CALL_SOCKET_EVENTS.START, { receiverId: target.id, callType });
  };

  const startAudioCall = useCallback(
    (user: TUser | CallPeer) => void startCall(user, CALL_TYPE.AUDIO),
    [],
  );
  const startVideoCall = useCallback(
    (user: TUser | CallPeer) => void startCall(user, CALL_TYPE.VIDEO),
    [],
  );

  const acceptCall = useCallback(async () => {
    const socket = getSocket();
    const incomingCallId = callIdRef.current;
    const incomingPeer = peerRef.current;
    const incomingType = callType ?? null;
    if (!incomingCallId || !incomingPeer || !incomingType) {
      showToast(FAILED, "No incoming call to accept");
      return;
    }

    const { stream, error } = await acquireMedia(incomingType);
    if (error) {
      dispatch(RESET_CALL());
      showToast(FAILED, error);
      return;
    }
    if (!stream) return;

    localStreamRef.current = stream;
    setLocalStream(stream);
    applyMediaToTracks(stream);

    directionRef.current = "incoming";
    isInitiatorRef.current = false;
    if (incomingTimerRef.current) {
      clearTimeout(incomingTimerRef.current);
      incomingTimerRef.current = null;
    }
    stopRingtone();

    const pc = createPeerConnection(stream);
    pcRef.current = pc;
    dispatch(SET_CALL_CONNECTING());
    dispatch(SET_CALL_ACTIVE());
    socket?.emit(CALL_SOCKET_EVENTS.ACCEPT, { callId: incomingCallId });
  }, [callType, dispatch]);

  const rejectCall = useCallback(() => {
    const socket = getSocket();
    const wasIncoming = directionRef.current === "incoming";
    if (callIdRef.current) {
      socket?.emit(
        wasIncoming ? CALL_SOCKET_EVENTS.REJECT : CALL_SOCKET_EVENTS.END,
        { callId: callIdRef.current },
      );
    }
    stopRingtone();
    if (incomingTimerRef.current) {
      clearTimeout(incomingTimerRef.current);
      incomingTimerRef.current = null;
    }
    cleanupMediaAndPeer();
    dispatch(RESET_CALL());
    if (wasIncoming) {
      dispatch(
        SET_CALL_SUMMARY({
          reason: "rejected",
          durationSeconds: 0,
          peerName: peerRef.current?.name,
          message: "Call declined",
        }),
      );
      showToast(INFO, "Call declined");
    } else {
      dispatch(
        SET_CALL_SUMMARY({
          reason: "ended",
          durationSeconds: 0,
          peerName: peerRef.current?.name,
          message: "Call cancelled",
        }),
      );
      showToast(INFO, "Call cancelled");
    }
    peerRef.current = null;
  }, [dispatch]);

  const endCall = useCallback(() => {
    const socket = getSocket();
    const dur = callState.connectedAt ? Math.round((Date.now() - callState.connectedAt) / 1000) : 0;
    if (callIdRef.current) {
      socket?.emit(CALL_SOCKET_EVENTS.END, {
        callId: callIdRef.current,
        durationSeconds: dur,
      });
    }
    stopRingtone();
    cleanupMediaAndPeer();
    dispatch(RESET_CALL());
    dispatch(
      SET_CALL_SUMMARY({
        reason: "ended",
        durationSeconds: dur,
        peerName: peerRef.current?.name,
        message: "Call ended",
      }),
    );
    peerRef.current = null;
  }, [callState.connectedAt, dispatch]);

  /* ── Media toggles ───────────────────────────────────────── */
  const toggleMic = useCallback(() => {
    const next = !mediaStateRef.current.micOn;
    mediaStateRef.current.micOn = next;
    localStreamRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = next;
    });
    dispatch(SET_MIC(next));
  }, [dispatch]);

  const toggleCamera = useCallback(() => {
    const next = !mediaStateRef.current.camOn;
    mediaStateRef.current.camOn = next;
    localStreamRef.current?.getVideoTracks().forEach((track) => {
      track.enabled = next;
    });
    dispatch(SET_CAMERA(next));
  }, [dispatch]);

  const stopScreenShare = useCallback(async () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
    }
    const sender = pcRef.current?.getSenders().find((s) => {
      return s.track?.kind === "video" && s.track.id !== screenStreamRef.current?.id;
    });
    const cameraTrack = localStreamRef.current?.getVideoTracks()[0];
    if (sender && cameraTrack) {
      try {
        await sender.replaceTrack(cameraTrack);
      } catch {
        // ignore replace failures
      }
    }
    mediaStateRef.current.sharing = false;
    dispatch(SET_SCREEN_SHARE(false));
  }, [dispatch]);

  const startScreenShare = useCallback(async () => {
    if (!navigator.mediaDevices?.getDisplayMedia) {
      showToast(FAILED, "Screen sharing is not supported in this browser");
      return;
    }
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      const screenTrack = screenStream.getVideoTracks()[0];
      screenStreamRef.current = screenStream;

      screenTrack.addEventListener("ended", () => {
        void stopScreenShare();
      });

      const sender = pcRef.current?.getSenders().find((s) => s.track?.kind === "video");
      if (sender && screenTrack) {
        await sender.replaceTrack(screenTrack);
      }
      mediaStateRef.current.sharing = true;
      dispatch(SET_SCREEN_SHARE(true));
    } catch (err: any) {
      if (err?.name !== "NotAllowedError") {
        showToast(FAILED, "Unable to share your screen");
      }
    }
  }, [dispatch, stopScreenShare]);

  const toggleScreenShare = useCallback(() => {
    if (mediaStateRef.current.sharing) {
      void stopScreenShare();
    } else {
      void startScreenShare();
    }
  }, [startScreenShare, stopScreenShare]);

  const clearSummary = useCallback(() => {
    dispatch(CLEAR_CALL_SUMMARY());
  }, [dispatch]);

  /* ── Socket listener registry ─────────────────────────────── */
  const sendOffer = async (pc: RTCPeerConnection) => {
    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      getSocket()?.emit(CALL_SOCKET_EVENTS.RTC_OFFER, {
        callId: callIdRef.current,
        to: peerIdRef.current,
        description: pc.localDescription,
      });
    } catch {
      handleCallEnded("error", 0, "Unable to establish the call");
    }
  };

  const detachSocketListeners = useCallback(() => {
    const socket = attachedSocketRef.current;
    if (socket) {
      listenersRef.current.forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    }
    listenersRef.current = [];
    attachedSocketRef.current = null;
  }, []);

  const attachSocketListeners = useCallback(() => {
    const socket = getSocket();
    if (!socket || attachedSocketRef.current === socket) return;
    detachSocketListeners();

    const registry: Array<[string, (...args: any[]) => void]> = [
      // Server → callee: an incoming ring.
      [
        CALL_SOCKET_EVENTS.INCOMING,
        ({ callId, caller, callType: incomingType }: any) => {
          if (directionRef.current) {
            // Busy — politely reject the incoming attempt.
            socket.emit(CALL_SOCKET_EVENTS.REJECT, { callId });
            return;
          }
          const info = {
            id: String(caller?.id ?? ""),
            name: caller?.name || "Unknown",
            img: caller?.img || "",
          };
          callIdRef.current = callId;
          peerRef.current = info;
          peerIdRef.current = info.id;
          directionRef.current = "incoming";
          dispatch(SET_INCOMING_CALL({ callId, caller: info, callType: incomingType }));
          startRingtone();
          if (incomingTimerRef.current) clearTimeout(incomingTimerRef.current);
          incomingTimerRef.current = setTimeout(() => {
            if (directionRef.current === "incoming") {
              stopRingtone();
              handleCallEnded("missed", 0, "Missed call");
            }
          }, CALL_RING_TIMEOUT_MS);
        },
      ],

      // Server → caller: the call has an id now.
      [
        CALL_SOCKET_EVENTS.STARTING,
        ({ callId, receiver }: any) => {
          callIdRef.current = callId;
          if (receiver?.id) {
            const info = {
              id: String(receiver.id),
              name: receiver.name || "Unknown",
              img: receiver.img || "",
            };
            peerRef.current = info;
            dispatch(SET_PEER(info));
          }
        },
      ],

      // Server → caller: callee accepted → issue the WebRTC offer.
      [
        CALL_SOCKET_EVENTS.ACCEPTED,
        ({ callId, callee }: any) => {
          if (directionRef.current !== "outgoing") return;
          callIdRef.current = callId;
          if (callee?.id) {
            const info = {
              id: String(callee.id),
              name: callee.name || "Unknown",
              img: callee.img || "",
            };
            peerRef.current = info;
            dispatch(SET_PEER(info));
          }
          stopRingtone();
          dispatch(SET_CALL_CONNECTING());
          dispatch(SET_CALL_ACTIVE());
          if (!pcRef.current && localStreamRef.current) {
            pcRef.current = createPeerConnection(localStreamRef.current);
          }
          if (pcRef.current) void sendOffer(pcRef.current);
        },
      ],

      // Server → callee: offer from the caller.
      [
        CALL_SOCKET_EVENTS.RTC_OFFER,
        async ({ callId, from, description }: any) => {
          if (String(callId) !== String(callIdRef.current)) return;
          if (String(from) !== String(peerIdRef.current)) return;
          let pc = pcRef.current;
          if (!pc) {
            if (!localStreamRef.current) return;
            pc = createPeerConnection(localStreamRef.current);
            pcRef.current = pc;
          }
          try {
            await pc.setRemoteDescription(description);
            pendingCandidatesRef.current.forEach((candidate) => {
              void pc?.addIceCandidate(candidate).catch(() => {});
            });
            pendingCandidatesRef.current = [];
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            getSocket()?.emit(CALL_SOCKET_EVENTS.RTC_ANSWER, {
              callId,
              to: from,
              description: pc.localDescription,
            });
          } catch {
            handleCallEnded("error", 0, "Unable to connect the call");
          }
        },
      ],

      // Server → caller: answer from the callee.
      [
        CALL_SOCKET_EVENTS.RTC_ANSWER,
        async ({ callId, description }: any) => {
          if (String(callId) !== String(callIdRef.current)) return;
          if (!pcRef.current) return;
          try {
            await pcRef.current.setRemoteDescription(description);
            pendingCandidatesRef.current.forEach((candidate) => {
              void pcRef.current?.addIceCandidate(candidate).catch(() => {});
            });
            pendingCandidatesRef.current = [];
          } catch {
            // ICE / answer race — ignore, connectionState surfaces failures.
          }
        },
      ],

      // ICE candidates relayed between peers.

      [
        CALL_SOCKET_EVENTS.RTC_ICE_CANDIDATE,
        ({ callId, candidate }: any) => {
          if (String(callId) !== String(callIdRef.current)) return;
          const pc = pcRef.current;
          if (!pc) return;
          if (pc.remoteDescription) {
            void pc.addIceCandidate(candidate).catch(() => {});
          } else {
            pendingCandidatesRef.current.push(candidate);
          }
        },
      ],

      // Server → caller: callee declined。
      [
        CALL_SOCKET_EVENTS.REJECTED,
        ({ callId, message }: any) => {
          if (String(callId) !== String(callIdRef.current)) return;
          handleCallEnded("rejected", 0, message || "Call rejected");
        },
      ],

      // Server → caller: nobody answered。
      [
        CALL_SOCKET_EVENTS.MISSED,
        ({ callId, message }: any) => {
          if (String(callId) !== String(callIdRef.current)) return;
          handleCallEnded("missed", 0, message || "No answer");
        },
      ],

      // Server → callee: ring timed out。
      [
        CALL_SOCKET_EVENTS.TIMEOUT,
        ({ callId }: any) => {
          if (String(callId) !== String(callIdRef.current)) return;
          handleCallEnded("missed", 0, "Missed call");
        },
      ],

      // Server → everyone: call is over。
      [
        CALL_SOCKET_EVENTS.ENDED,
        ({ callId, duration }: any) => {
          if (String(callIdRef.current) !== String(callId)) return;
          handleCallEnded("ended", Number(duration) || 0);
        },
      ],

      // Server → client: fatal call error。
      [
        CALL_SOCKET_EVENTS.ERROR,
        ({ message }: any) => {
          handleCallEnded("error", 0, message || "Call failed");
        },
      ],
    ];

    registry.forEach(([event, handler]) => socket.on(event, handler));
    listenersRef.current = registry;
    attachedSocketRef.current = socket;
  }, [detachSocketListeners, dispatch]);

  /* ── Attach/detach watcher + mount cleanup ──────────────── */
  useEffect(() => {
    const attach = () => {
      const current = getSocket();
      if (current && attachedSocketRef.current !== current) {
        attachSocketListeners();
      } else if (!current && attachedSocketRef.current) {
        detachSocketListeners();
      }
    };
    const intervalId = setInterval(attach, 1000);
    attach();
    return () => {
      clearInterval(intervalId);
      detachSocketListeners();
      stopRingtone();
      cleanupMediaAndPeer();
    };
  }, [attachSocketListeners, detachSocketListeners]);

  const value = useMemo<CallContextValue>(
    () => ({
      status,
      callType,
      peer,
      callId,
      isCameraOn,
      isMicOn,
      isScreenSharing,
      isRemoteVideoReady,
      connectedAt: callState.connectedAt,
      error: callState.error,
      summary: callState.summary,
      localStream,
      remoteStream,
      startAudioCall,
      startVideoCall,
      acceptCall,
      rejectCall,
      endCall,
      toggleCamera,
      toggleMic,
      toggleScreenShare,
      clearSummary,
    }),
    [
      status,
      callType,
      peer,
      callId,
      isCameraOn,
      isMicOn,
      isScreenSharing,
      isRemoteVideoReady,
      callState.connectedAt,
      callState.error,
      callState.summary,
      localStream,
      remoteStream,
      startAudioCall,
      startVideoCall,
      acceptCall,
      rejectCall,
      endCall,
      toggleCamera,
      toggleMic,
      toggleScreenShare,
      clearSummary,
    ],
  );

  return (
    <CallContext.Provider value={value}>
      {children}
    </CallContext.Provider>
  );
};

export const useCall = (): CallContextValue => {
  const ctx = useContext(CallContext);
  if (!ctx) {
    throw new Error("useCall must be used within a <CallProvider>");
  }
  return ctx;
};