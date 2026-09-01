/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Chip,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import CallReceivedIcon from "@mui/icons-material/CallReceived";
import CallMadeIcon from "@mui/icons-material/CallMade";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import MicRoundedIcon from "@mui/icons-material/MicRounded";

import { RootState } from "../../redux/store";
import { getCallHistoryAPI } from "../../services/call";
import { CALL_STATUS, CALL_TYPE } from "../../constants/call";
import { CallLog } from "../../types/call";
import { PURPLE_PRIMARY, STATUS_ONLINE } from "../../theme";
import { SET_RECEIVER_ID } from "../../redux/features/chat/conversationSlice";
import { SET_ACTIVE_NAV_TAB } from "../../redux/features/settings/settingsSlice";
import UserAvatar from "../ui/UserAvatar";

const formatDuration = (seconds: number): string => {
  if (!seconds || seconds <= 0) return "\u2014";
  const minutes = Math.floor(seconds / 60);
  const rest = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
};

const formatTime = (dateStr?: string | null): string => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const STATUS_META: Record<string, { label: string; color: string }> = {
  [CALL_STATUS.COMPLETED]: { label: "Completed", color: STATUS_ONLINE },
  [CALL_STATUS.RECEIVED]: { label: "Received", color: "#3B82F6" },
  [CALL_STATUS.REJECTED]: { label: "Rejected", color: "#EF4444" },
  [CALL_STATUS.MISSED]: { label: "Missed", color: "#F59E0B" },
};

/** Call history sidebar for the "Calls" navigation tab. */
export const CallsSidebar: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { loginUser } = useSelector((state: RootState) => state.auth);
  const [logs, setLogs] = useState<CallLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loginUser?.id) return;
    setIsLoading(true);
    getCallHistoryAPI({})
      .then((res: any) => {
        if (res?.success && Array.isArray(res.data)) {
          setLogs(res.data);
        }
      })
      .catch(() => setLogs([]))
      .finally(() => setIsLoading(false));
  }, [loginUser?.id]);

  const openConversation = (peerId: string | number) => {
    dispatch(SET_RECEIVER_ID(String(peerId)));
    dispatch(SET_ACTIVE_NAV_TAB("chats"));
  };

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <Box sx={{ px: 2.5, pt:  2.5, pb:  1.5 }}>
<Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.05rem" }}>
          Calls
        </Typography>
        <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: "0.78rem" }}>
          Audio and video call history
        </Typography>
      </Box>

      <Divider sx={{ mx: 2.5, borderColor: theme.palette.divider }} />

      {isLoading ? (
        <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CircularProgress size={26} sx={{ color: PURPLE_PRIMARY }} />
        </Box>
      ) : logs.length === 0 ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1.5,
            px: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 600 }}>
            No calls yet
          </Typography>
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary, maxWidth: 260 }}>
            Start an audio or video call from any chat header to see it here.

          </Typography>
        </Box>
      ) : (
        <List sx={{ flex: 1, overflowY: "auto", px: 1.5, py:  1 }}>
{logs.map((log, index) => {
            const isOutgoing = String(log.caller_id) === String(loginUser?.id);
            const peerName = isOutgoing ? log.receiver_name : log.caller_name;
            const peerImg = isOutgoing ? log.receiver_img : log.caller_img;
            const isVideo = log.call_type === CALL_TYPE.VIDEO;
            const meta = STATUS_META[log.call_status] || STATUS_META[CALL_STATUS.RECEIVED];
            const Icon = isOutgoing ? CallMadeIcon : CallReceivedIcon;

            return (
              <React.Fragment key={log.id}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() =>
                      openConversation(isOutgoing ? String(log.receiver_id) : String(log.caller_id))
                    }
                    sx={{ borderRadius: 3, px:  1.5, py:  1.25 }}
                  >
                    <ListItemAvatar>
                      <UserAvatar name={peerName} img={peerImg} size={44} isOnline={false} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography noWrap sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                          {peerName || "Unknown"}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mt: 0.25 }}>
                          <Icon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                          {isVideo ? (
                            <VideocamRoundedIcon sx={{ fontSize: 15, color: theme.palette.text.secondary }} />
                          ) : (
                            <MicRoundedIcon sx={{ fontSize: 15, color: theme.palette.text.secondary }} />
                          )}
                          <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: "0.75rem" }}>
                            {formatTime(log.start_time)}
                          </Typography>
                        </Box>
                      }
                    />
                    <Chip
                      label={meta?.label}
                      size="small"
                      sx={{
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        height: 22,
                        color: meta?.color,
                        backgroundColor: alpha(meta?.color || "#888888", 0.1),
                        border: `1px solid ${alpha(meta?.color || "#888888", 0.25)}`,
                        ml: 1,
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{ color: theme.palette.text.secondary, fontSize: "0.72rem", ml: 0.75, minWidth: 36, textAlign: "right" }}
                    >
                      {log.call_status === CALL_STATUS.COMPLETED
                        ? formatDuration(log.duration_seconds)
                        : "—"}
                    </Typography>
                  </ListItemButton>
                </ListItem>
                {index < logs.length - 1 && (
                  <Divider component="li" sx={{ borderColor: theme.palette.divider, opacity: 0.6 }} />
                )}
              </React.Fragment>
            );
          })}
        </List>
      )}
    </Box>
  );
};

export default CallsSidebar;
