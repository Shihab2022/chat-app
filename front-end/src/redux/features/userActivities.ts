import { createSlice } from "@reduxjs/toolkit";

export type TActivitiesSlice = {
  authUser: null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  onlineUsers: string[];
  socket: null;
};

const initialState: TActivitiesSlice = {
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
};

const activitiesSlice = createSlice({
  name: "activities",
  initialState,
  reducers: {
    SET_ACTIVITIES: (_state, action) => {
      return action.payload;
    },
  },
});

export const { SET_ACTIVITIES } = activitiesSlice.actions;
export default activitiesSlice.reducer;
