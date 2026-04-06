/* eslint-disable @typescript-eslint/no-explicit-any */
import { setUser } from "../redux/features/auth/authSlice";
import { checkAuth } from "../services/auth";
import { getToken } from "./auth";
import { connectSocket } from "./socketService";

export const checkAuthRes = async (dispatch: any, setIsLoading: any) => {
  try {
    setIsLoading(true);
    const token = getToken();
    const res = await checkAuth({ token });
    console.log({ res });
    console.log({ "res.success": res.success });
    if (res.success) {
      const user = res?.data;
      connectSocket(user?.id, dispatch);
      dispatch(setUser(user));
    }
  } catch (error) {
    console.log({ error });
  } finally {
    setIsLoading(false);
  }
};
