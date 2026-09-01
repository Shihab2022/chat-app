/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { motion } from "framer-motion";
import CallEndIcon from "@mui/icons-material/CallEnd";
import UserAvatar from "../ui/UserAvatar";
import { useCall } from "./CallProvider";
import { CALL_TYPE } from "../../constants/call";

/**
 * Full-screen "calling…" overlay shown while ringing the callee.
 */
export const OutgoingCallOverlay: React.FC = () => {
  const { peer, callType, rejectCall } = useCall();
  const isVideo = callType === CALL_TYPE.VIDEO;

  return (
    <Box
      role="dialog"
      aria-modal="true"
      aria-label="Outgoing call"
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
      {/* Pulsing outgoing avatar ring */}
      <motion.div
        animate={{ scale: [1, 1.06, 1], opacity: [1, 0.85, 1] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          display: "inline-flex",
          borderRadius: "50%",
          padding: 6,
          border: "3px solid rgba(124,58,237,0.8)",
          backgroundColor: "rgba(124,58,237,0.12)",
        }}
      >
        <UserAvatar name={peer?.name} img={peer?.img} size={104} />
      </motion.div>

      <Box sx={{ textAlign: "center" }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, color: "#FFFFFF", mb: 0.5, textShadow: "0 2px 12px rgba(0,0,0,0.45)" }}
        >
          {peer?.name || "Unknown"}
        </Typography>
        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.72)", fontSize: "0.9rem" }}>
          {isVideo ? "Video calling…" : "Voice calling…"}
        </Typography>
        <Typography
          variant="caption"
          sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.75, color: "#A78BFA", mt: 1 }}
        >
          <Box
            component="span"
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#A78BFA",
              animation: "callPulse 1s ease-in-out infinite",
              "@keyframes callPulse": {
                "0%, 100%": { opacity: 0.3, transform: "scale(0.8)" },
                "50%": { opacity: 1, transform: "scale(1.1)" },
              },
            }}
          />
          RINGING…
        </Typography>
      </Box>

      <IconButton
        onClick={rejectCall}
        aria-label="Cancel call"
        sx={{
          width: 64,
          height: 64,
          mt: 1,
          backgroundColor: "#EF4444",
          color: "#FFFFFF",
          boxShadow: "0 8px 24px rgba(239,68,68,0.5)",
          "&:hover": { backgroundColor: "#DC2626", transform: "scale(1.06)" },
        }}
      >
        <CallEndIcon sx={{ fontSize: 34 }} />
      </IconButton>
    </Box>
  );
};

export default OutgoingCallOverlay;