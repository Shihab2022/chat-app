/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CallPeer, CallSummary, CallType, CallUiStatus } from "../../../types/call";

export interface CallState {
  status: CallUiStatus;
  callType: CallType | null;
  callId: number | string | null;
  peer: CallPeer | null;
  isCameraOn: boolean;
  isMicOn: boolean;
  isScreenSharing: boolean;
  isRemoteVideoReady: boolean;
  connectedAt: number | null;
  error: string | null;
  summary: CallSummary | null;
}

const initialCallState: CallState = {
  status: "idle",
  callType: null,
  callId: null,
  peer: null,
  isCameraOn: true,
  isMicOn: true,
  isScreenSharing: false,
  isRemoteVideoReady: false,
  connectedAt: null,
  error: null,
  summary: null,
};

const callSlice = createSlice({
  name: "call",
  initialState: initialCallState,
  reducers: {
    /** Callee receives a ring. */
    SET_INCOMING_CALL: (
      state,
      action: PayloadAction<{ callId: number | string; caller: CallPeer; callType: CallType }>,
    ) => {
      state.status = "incoming";
      state.callId = action.payload.callId;
      state.peer = { ...action.payload.caller, id: String(action.payload.caller.id) };
      state.callType = action.payload.callType;
      state.summary = null;
      state.error = null;
      state.isRemoteVideoReady = false;
    },

    /** Caller starts ringing. */
    SET_OUTGOING_CALL: (
      state,
      action: PayloadAction<{ receiver: CallPeer; callType: CallType }>,
    ) => {
      state.status = "outgoing";
      state.peer = { ...action.payload.receiver, id: String(action.payload.receiver.id) };
      state.callType = action.payload.callType;
      state.summary = null;
      state.error = null;
      state.isRemoteVideoReady = false;
    },

    SET_CALL_ID: (state, action: PayloadAction<number | string | null>) => {
      state.callId = action.payload;
    },

    /** Offer/answer exchanged — media establishing. */
    SET_CALL_CONNECTING: (state) => {
      state.status = "connecting";
    },

    /** `RTCPeerConnection` reached the connected state. */
    SET_CALL_ACTIVE: (state) => {
      state.status = "active";
      state.connectedAt = Date.now();
    },

    SET_PEER: (state, action: PayloadAction<CallPeer>) => {
      state.peer = { ...action.payload, id: String(action.payload.id) };
    },

    SET_CAMERA: (state, action: PayloadAction<boolean>) => {
      state.isCameraOn = action.payload;
    },
    SET_MIC: (state, action: PayloadAction<boolean>) => {
      state.isMicOn = action.payload;
    },
    SET_SCREEN_SHARE: (state, action: PayloadAction<boolean>) => {
      state.isScreenSharing = action.payload;
    },
    SET_REMOTE_VIDEO_READY: (state, action: PayloadAction<boolean>) => {
      state.isRemoteVideoReady = action.payload;
    },
    SET_CALL_ERROR: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    SET_CALL_SUMMARY: (state, action: PayloadAction<CallSummary>) => {
      state.summary = action.payload;
    },
    CLEAR_CALL_SUMMARY: (state) => {
      state.summary = null;
    },

    /** Reset the call engine. Keeps `summary` so the UI can flash the result. */
    RESET_CALL: (state) => {
      state.status = "idle";
      state.callType = null;
      state.callId = null;
      state.peer = null;
      state.isCameraOn = true;
      state.isMicOn = true;
      state.isScreenSharing = false;
      state.isRemoteVideoReady = false;
      state.connectedAt = null;
      state.error = null;
    },
  },
});

export const {
  SET_INCOMING_CALL,
  SET_OUTGOING_CALL,
  SET_CALL_ID,
  SET_CALL_CONNECTING,
  SET_CALL_ACTIVE,
  SET_PEER,
  SET_CAMERA,
  SET_MIC,
  SET_SCREEN_SHARE,
  SET_REMOTE_VIDEO_READY,
  SET_CALL_ERROR,
  SET_CALL_SUMMARY,
  CLEAR_CALL_SUMMARY,
  RESET_CALL,
} = callSlice.actions;

export default callSlice.reducer;