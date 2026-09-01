/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import { useCall } from "./CallProvider";
import { CALL_TYPE } from "../../constants/call";
import UserAvatar from "../ui/UserAvatar";

const formatDuration = (seconds: number): string => {
  const total = Math.max(0, Math.floor(seconds ?? 0));
  const minutes = Math.floor(total / 60);
  const rest = total % 60;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
};

interface ControlButtonProps {
  label: string;
  onClick: () => void;
  active?: boolean;
  activeColor?: string;
  children: React.ReactNode;
}

const ControlButton = ({
  label,
  onClick,
  active = false,
  activeColor = "#7C3AED",
  children,
}: ControlButtonProps) => (
  <Tooltip title={label} arrow>
    <IconButton
      onClick={onClick}
      aria-label={label}
      sx={{
        width: 52,
        height: 52,
        backgroundColor: active ? activeColor : "rgba(255,255,255,0.14)",
        color: "#FFFFFF",
        "&:hover": {
          backgroundColor: active ? activeColor : "rgba(255,255,255,0.24)",
          transform: "scale(1.06)",
        },
      }}
    >
      {children}
    </IconButton>
  </Tooltip>
);

/**
 * Full-screen active calling screen: video grid (remote fullbleed +
 * local PiP), canvas dock with mic/camera/screen-share/end-call controls.
 */
export const ActiveCallScreen: React.FC = () => {
  const {
    status,
    peer,
    callType,
    isMicOn,
    isCameraOn,
    isScreenSharing,
    connectedAt,
    localStream,
    remoteStream,
    toggleMic,
    toggleCamera,
    toggleScreenShare,
    endCall,
  } = useCall();

  const isVideo = callType === CALL_TYPE.VIDEO;
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (status !== "active" || !connectedAt) return;
    const update = () =>
      setElapsed(Math.max(0, Math.floor((Date.now() - connectedAt) / 1000)));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [status, connectedAt]);

  const setRemoteVideoRef = useCallback(
    (node: HTMLVideoElement | null) => {
      if (node) node.srcObject = remoteStream;
    },
    [remoteStream],
  );

  const setLocalVideoRef = useCallback(
    (node: HTMLVideoElement | null) => {
      if (node) node.srcObject = localStream;
    },
    [localStream],
  );

  return (
    <Box
      role="dialog"
      aria-modal="true"
      aria-label="Active call"
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 1400,
        backgroundColor: "#0A0E1A",
        color: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Top status bar */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2.5,
          py: 1.5,
          background: "linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0))",
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: "1.05rem", lineHeight: 1.2 }}>
            {peer?.name || "Unknown"}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "rgba(255,255,255,0.78)", display: "flex", alignItems: "center", gap: 0.75 }}
          >
            {status === "active" ? formatDuration(elapsed) : "Connecting…"}
            {status === "connecting" && (
              <CircularProgress size={14} thickness={5} sx={{ color: "#A78BFA" }} />
            )}
          </Typography>
        </Box>
        {isVideo && status === "active" && (
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>
            {isCameraOn ? "Camera on" : "Camera off"}
          </Typography>
        )}
      </Box>

      {/* Main video area */}
      <Box
        sx={{
          flex: 1,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 0,
        }}
      >
        {isVideo ? (
          <>
            {remoteStream ? (
              <video
                ref={setRemoteVideoRef}
                autoPlay
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  display: "block",
                  backgroundColor: "#000",
                }}
              />
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5 }}>
                <UserAvatar name={peer?.name} img={peer?.img} size={96} />
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                  Connecting video…
                </Typography>
              </Box>
            )}

            {localStream && remoteStream && (
              <video
                ref={setLocalVideoRef}
                autoPlay
                playsInline
                muted
                style={{
                  position: "absolute",
                  top: 68,
                  right: 16,
                  width: 150,
                  height: 112,
                  objectFit: "cover",
                  borderRadius: 12,
                  border: "2px solid rgba(255,255,255,0.35)",
                  backgroundColor: "#000",
                  zIndex: 2,
                }}
              />
            )}
          </>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5 }}>
            <UserAvatar name={peer?.name} img={peer?.img} size={110} />
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
              Voice call · {formatDuration(elapsed)}
            </Typography>
          </Box>
        )}

        {status === "connecting" && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.5,
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 3,
            }}
          >
            <CircularProgress sx={{ color: "#A78BFA" }} />
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)" }}>
              Connecting…
            </Typography>
          </Box>
        )}
      </Box>

      {/* Control dock */}
      <Box
        sx={{
          position: "relative",
          zIndex: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          px: 2,
          py: 2.5,
          background: "linear-gradient(0deg, rgba(0,0,0,0.6), rgba(0,0,0,0))",
        }}
      >
        <ControlButton
          label={isMicOn ? "Mute microphone" : "Unmute microphone"}
          onClick={toggleMic}
          active={!isMicOn}
          activeColor="#EF4444"
        >
          {isMicOn ? <MicIcon sx={{ fontSize: 26 }} /> : <MicOffIcon sx={{ fontSize: 26 }} />}
        </ControlButton>

        {isVideo && (
          <ControlButton
            label={isCameraOn ? "Turn camera off" : "Turn camera on"}
            onClick={toggleCamera}
            active={!isCameraOn}
            activeColor="#EF4444"
          >
            {isCameraOn ? <VideocamIcon sx={{ fontSize: 26 }} /> : <VideocamOffIcon sx={{ fontSize: 26 }} />}
          </ControlButton>
        )}

        {isVideo && (
          <ControlButton
            label={isScreenSharing ? "Stop sharing" : "Share screen"}
            onClick={toggleScreenShare}
            active={isScreenSharing}
          >
            {isScreenSharing ? (
              <StopScreenShareIcon sx={{ fontSize: 26 }} />
            ) : (
              <ScreenShareIcon sx={{ fontSize: 26 }} />
            )}
          </ControlButton>
        )}

        <Tooltip title="End call" arrow>
          <IconButton
            onClick={endCall}
            aria-label="End call"
            sx={{
              width: 62,
              height: 62,
              backgroundColor: "#EF4444",
              color: "#FFFFFF",
              boxShadow: "0 8px 26px rgba(239,68,68,0.5)",
              "&:hover": { backgroundColor: "#DC2626", transform: "scale(1.06)" },
            }}
          >
            <CallEndIcon sx={{ fontSize: 32 }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default ActiveCallScreen;