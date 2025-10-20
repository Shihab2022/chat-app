/* eslint-disable @typescript-eslint/no-explicit-any */
import { setUser } from "../redux/features/auth/authSlice";
import { checkAuth } from "../services/auth";
import { getToken } from "./auth";
import { connectSocket } from "./socketService";

export const checkAuthRes = async (dispatch: any) => {
  try {
    const token = getToken();
    const res = await checkAuth({ token });
    if (res.success) {
      const user = res?.data;
      connectSocket(user?._id, dispatch);
      dispatch(setUser(user));
    }
  } catch (error) {
    console.log({ error });
  }
};
