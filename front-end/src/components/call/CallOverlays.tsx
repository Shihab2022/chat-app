/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useCall } from "./CallProvider";
import IncomingCallOverlay from "./IncomingCallOverlay";
import OutgoingCallOverlay from "./OutgoingCallOverlay";
import ActiveCallScreen from "./ActiveCallScreen";
import { CallSummary } from "../../types/call";

const formatDuration = (seconds: number): string => {
  const total = Math.max(0, Math.floor(seconds ?? 0));
  const minutes = Math.floor(total / 60);
  const rest = total % 60;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
};

const summaryText = (summary: CallSummary): string => {
  switch (summary.reason) {
    case "rejected":
      return summary.message || "Call rejected";
    case "missed":
      return summary.message || "Missed call";
    case "unavailable":
      return summary.message || "User is offline";
    case "error":
      return summary.message || "Call failed";
    default:
      return summary.durationSeconds > 0
        ? `Call ended · ${formatDuration(summary.durationSeconds)}`
        : summary.message || "Call ended";
  }
};

/**
 * Root renderer for the call lifecycle: mounts the correct
 * full-screen overlay per state, plus a transient result pill.
 */
export const CallOverlays: React.FC = () => {
  const { status, summary, clearSummary } = useCall();

  useEffect(() => {
    if (!summary) return;
    const id = setTimeout(clearSummary, 5000);
    return () => clearTimeout(id);
  }, [summary, clearSummary]);

  return (
    <>
      {status === "incoming" && <IncomingCallOverlay />}
      {status === "outgoing" && <OutgoingCallOverlay />}
      {(status === "connecting" || status === "active") && <ActiveCallScreen />}
      {summary && status === "idle" && (
        <Box
          role="status"
          sx={{
            position: "fixed",
            bottom: 26,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1450,
            backgroundColor: "rgba(15,20,30,0.92)",
            color: "#FFFFFF",
            px: 2.5,
            py: 1.25,
            borderRadius: "999px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ color: "#FFFFFF", fontSize: "0.82rem", fontWeight: 600 }}>
            {summaryText(summary)}
          </Typography>
        </Box>
      )}
    </>
  );
};

export default CallOverlays;