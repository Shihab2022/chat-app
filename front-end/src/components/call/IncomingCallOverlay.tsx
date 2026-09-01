/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { motion } from "framer-motion";
import CallIcon from "@mui/icons-material/Call";
import CallEndIcon from "@mui/icons-material/CallEnd";
import UserAvatar from "../ui/UserAvatar";
import { useCall } from "./CallProvider";
import { CALL_TYPE } from "../../constants/call";

/**
 * WhatsApp-style full-screen incoming call notification overlay.
 * Green Accept + red Reject, accompanied by the caller's identity.
 */
export const IncomingCallOverlay: React.FC = () => {
  const { peer, callType, acceptCall, rejectCall } = useCall();
  const isVideo = callType === CALL_TYPE.VIDEO;

  return (
    <Box
      role="dialog"
      aria-modal="true"
      aria-label="Incoming call"
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 1400,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        background:
          "radial-gradient(1200px 700px at 50% 35%, rgba(37,36,54,0.94) 0%, rgba(9,10,16,0.97) 100%)",
        color: "#FFFFFF",
        backdropFilter: "blur(6px)",
      }}
    >
      {/* Pulsing avatar ring */}
      <motion.div
        animate={{ scale: [1, 1.09, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          display: "inline-flex",
          borderRadius: "50%",
          padding: 6,
          border: "3px solid rgba(16,185,129,0.85)",
          backgroundColor: "rgba(16,185,129,0.12)",
        }}
      >
        <UserAvatar name={peer?.name} img={peer?.img} size={112} />
      </motion.div>

      <Box sx={{ textAlign: "center" }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, color: "#FFFFFF", mb: 0.5, textShadow: "0 2px 12px rgba(0,0,0,0.45)" }}
        >
          {peer?.name || "Unknown"}
        </Typography>
        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.72)", fontSize: "0.9rem" }}>
          {isVideo ? "Incoming video call…" : "Incoming voice call…"}
        </Typography>
      </Box>

      {/* Accept / Reject */}
      <Box sx={{ display: "flex", gap: 6, alignItems: "center", mt: 1 }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
          <IconButton
            onClick={() => void acceptCall()}
            aria-label="Accept call"
            sx={{
              width: 58,
              height: 58,
              backgroundColor: "#10B981",
              color: "#FFFFFF",
              boxShadow: "0 6px 20px rgba(16,185,129,0.45)",
              "&:hover": { backgroundColor: "#0D9668", transform: "scale(1.06)" },
            }}
          >
            <CallIcon sx={{ fontSize: 30 }} />
          </IconButton>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)" }}>
            Accept
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
          <IconButton
            onClick={rejectCall}
            aria-label="Reject call"
            sx={{
              width: 58,
              height: 58,
              backgroundColor: "#EF4444",
              color: "#FFFFFF",
              boxShadow: "0 6px 20px rgba(239,68,68,0.45)",
              "&:hover": { backgroundColor: "#DC2626", transform: "scale(1.06)" },
            }}
          >
            <CallEndIcon sx={{ fontSize: 30 }} />
          </IconButton>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)" }}>
            Reject
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default IncomingCallOverlay;