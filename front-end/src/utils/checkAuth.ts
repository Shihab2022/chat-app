/* eslint-disable @typescript-eslint/no-explicit-any */
import { setUser } from "../redux/features/auth/authSlice";
import { checkAuth } from "../services/auth";
import { getToken } from "./auth";
import { connectSocket } from "./socketService";
import { hydrateUserSettings } from "./userSettings";

export const checkAuthRes = async (dispatch: any, setIsLoading: any) => {
  try {
    setIsLoading(true);
    const token = getToken();
    const res = await checkAuth({ token });
    if (res.success) {
      const user = res?.data;
      connectSocket(user?.id, dispatch);
      dispatch(setUser(user));
      hydrateUserSettings(dispatch, user);
    }
  } catch (error) {
    console.log({ error });
  } finally {
    setIsLoading(false);
  }
};
