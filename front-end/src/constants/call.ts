/**
 * Call domain constants — shared event names between the React client
 * and the Node/Socket.io signaling server.
 */

export const CALL_STATUS = {
  RECEIVED: "received",
  REJECTED: "rejected",
  MISSED: "missed",
  COMPLETED: "completed",
} as const;

export const CALL_TYPE = {
  AUDIO: "audio",
  VIDEO: "video",
} as const;

export const CALL_SOCKET_EVENTS = {
  // Caller → server
  START: "call:start",
  ACCEPT: "call:accept",
  REJECT: "call:reject",
  END: "call:end",

  // Server → caller
  STARTING: "call:starting",
  ACCEPTED: "call:accepted",
  REJECTED: "call:rejected",
  MISSED: "call:missed",

  // Server → callee
  INCOMING: "call:incoming",
  TIMEOUT: "call:timeout",

  // Server → both
  ENDED: "call:ended",
  ERROR: "call:error",

  // WebRTC signaling relays
  RTC_OFFER: "webrtc:offer",
  RTC_ANSWER: "webrtc:answer",
  RTC_ICE_CANDIDATE: "webrtc:ice-candidate",
} as const;

export const CALL_RING_TIMEOUT_MS = 30_000;

export const STUN_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];