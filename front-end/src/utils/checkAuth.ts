/* eslint-disable @typescript-eslint/no-explicit-any */
import { setUser } from "../redux/features/auth/authSlice";
import { checkAuth } from "../services/auth";
import { connectSocket } from "./socketService";

export const checkAuthRes = async (dispatch: any) => {
  try {
    const res = await checkAuth();
    if (res.success) {
      const user = res?.data;
      connectSocket(user?._id, dispatch);
      dispatch(setUser(user));
    }
  } catch (error) {
    console.log({ error });
  }
};
