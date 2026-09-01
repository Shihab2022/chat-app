/**
 * Call domain types (frontend).
 */

export type CallType = "audio" | "video";
export type CallStatus = "received" | "rejected" | "missed" | "completed";

export interface CallPeer {
  id: string;
  name: string;
  img?: string;
}

export interface CallLog {
  id: string | number;
  caller_id: string | number;
  receiver_id: string | number;
  call_type: CallType;
  call_status: CallStatus;
  start_time: string | null;
  end_time: string | null;
  duration_seconds: number;
  created_at: string;
  caller_name?: string;
  caller_img?: string;
  receiver_name?: string;
  receiver_img?: string;
}

export type CallUiStatus =
  | "idle"
  | "incoming"
  | "outgoing"
  | "connecting"
  | "active";

export interface CallSummary {
  reason: "rejected" | "missed" | "ended" | "unavailable" | "error";
  durationSeconds: number;
  peerName?: string;
  message?: string;
}