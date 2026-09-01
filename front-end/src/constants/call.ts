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

/* ─────────────────────────────────────────────────────────────
 * Env-driven configuration (see front-end/#envSample).
 * ───────────────────────────────────────────────────────────── */

const positiveNumber = (raw: unknown, fallback: number): number => {
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : fallback;
};

const parseUrlList = (raw?: string): string[] =>
  String(raw || "")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);

/** Master switch for the calling feature (VITE_CALL_ENABLED). */
export const CALL_ENABLED = import.meta.env.VITE_CALL_ENABLED !== "false";

/** How long an incoming call rings before auto-dismissing (ms). */
export const CALL_RING_TIMEOUT_MS = positiveNumber(
  import.meta.env.VITE_CALL_RING_TIMEOUT_MS,
  30_000,
);

const turnUrl = String(import.meta.env.VITE_TURN_URL || "").trim();

/** ICE servers: default Google STUN + optional extras + optional TURN relay. */
export const ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
  ...parseUrlList(import.meta.env.VITE_STUN_SERVERS).map((urls) => ({ urls })),
  ...(turnUrl
    ? [
        {
          urls: turnUrl,
          username: import.meta.env.VITE_TURN_USERNAME || undefined,
          credential: import.meta.env.VITE_TURN_CREDENTIAL || undefined,
        },
      ]
    : []),
];