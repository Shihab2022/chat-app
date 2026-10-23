/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_API_URL: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;

  // ── Audio/Video Calling (WebRTC) ──
  /** Set to "false" to hide all calling UI. */
  readonly VITE_CALL_ENABLED?: string;
  /** Incoming-call ring timeout in milliseconds. */
  readonly VITE_CALL_RING_TIMEOUT_MS?: string;
  /** Extra STUN servers, comma separated. */
  readonly VITE_STUN_SERVERS?: string;
  /** TURN relay URL for strict NAT / corporate networks. */
  readonly VITE_TURN_URL?: string;
  readonly VITE_TURN_USERNAME?: string;
  readonly VITE_TURN_CREDENTIAL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
