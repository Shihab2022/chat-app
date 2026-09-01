export type CallType = 'audio' | 'video';

export type CallStatus = 'received' | 'rejected' | 'missed' | 'completed';

export interface TCallLog {
  id: number | string;
  caller_id: number | string;
  receiver_id: number | string;
  call_type: CallType;
  call_status: CallStatus;
  start_time: string | Date | null;
  end_time: string | Date | null;
  duration_seconds: number;
  created_at: string | Date;
  updated_at: string | Date;
}

export interface TCallLogResult extends TCallLog {
  caller_name?: string;
  caller_img?: string;
  receiver_name?: string;
  receiver_img?: string;
}

export interface TCallPeerInfo {
  id: string | number;
  name: string;
  img?: string;
}