import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, CircularProgress, Typography } from "@mui/material";
import { RootState } from "../redux/store";
import { SET_RECEIVER_ID } from "../redux/features/chat/conversationSlice";
import { SET_ACTIVE_NAV_TAB } from "../redux/features/settings/settingsSlice";

export const InviteRedirect: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { loginUser } = useSelector((state: RootState) => state.auth);

  const targetId = searchParams.get("id") || searchParams.get("userId");
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      navigate(`/accept-invite?token=${token}`, { replace: true });
      return;
    }

    if (loginUser?.id) {
      if (targetId) {
        dispatch(SET_RECEIVER_ID(targetId));
        dispatch(SET_ACTIVE_NAV_TAB("chats"));
      }
      navigate("/chat", { replace: true });
    } else {
      if (targetId) {
        navigate(`/login?connect=${targetId}`, { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    }
  }, [loginUser, targetId, token, navigate, dispatch]);

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography variant="body2" color="text.secondary">
        Connecting you to Chatty...
      </Typography>
    </Box>
  );
};

export default InviteRedirect;
