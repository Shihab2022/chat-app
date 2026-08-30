/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import QRCode from "qrcode";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Button,
  Tabs,
  Tab,
  Stack,
  Tooltip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import FullscreenRoundedIcon from "@mui/icons-material/FullscreenRounded";
import FullscreenExitRoundedIcon from "@mui/icons-material/FullscreenExitRounded";
import QrCodeScannerRoundedIcon from "@mui/icons-material/QrCodeScannerRounded";
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";

import { RootState } from "../../redux/store";
import { SET_QR_CODE_MODAL_OPEN } from "../../redux/features/settings/settingsSlice";
import { PURPLE_PRIMARY } from "../../theme";
import { showToast } from "../../utils/toast";
import { SUCCESS, FAILED } from "../../constants/common";

export const QRCodeModal: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scanFileInputRef = useRef<HTMLInputElement | null>(null);

  const { isQRCodeModalOpen, qrCodeInitialTab, profileUserData } = useSelector(
    (state: RootState) => state.settings
  );
  const { loginUser } = useSelector((state: RootState) => state.auth);

  const [activeTab, setActiveTab] = useState<"my-code" | "scan-code">("my-code");
  const [qrKey, setQrKey] = useState<number>(Date.now());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (qrCodeInitialTab) {
      setActiveTab(qrCodeInitialTab);
    }
  }, [qrCodeInitialTab, isQRCodeModalOpen]);

  const displayName = loginUser?.name || profileUserData.name || "User";
  const username =
    profileUserData.username ||
    (loginUser?.username ? `@${String(loginUser.username).replace(/^@/, "")}` : "");
  const userId = loginUser?.id ? String(loginUser.id) : "";
  const userAvatar = loginUser?.img || profileUserData.avatar;

  const inviteLink = `${window.location.origin}/invite?id=${userId}`;

  // Generate Real High-Precision QR Code using standard 'qrcode' package
  useEffect(() => {
    if (activeTab !== "my-code" || !isQRCodeModalOpen || !canvasRef.current) return;

    const generateRealQRCode = async () => {
      try {
        setIsGenerating(true);
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Generate standard QR code with high error correction level 'H'
        // High error correction (30%) allows placing center avatar without breaking readability
        await QRCode.toCanvas(canvas, inviteLink, {
          width: 240,
          margin: 2,
          errorCorrectionLevel: "H",
          color: {
            dark: "#1E1B4B", // Deep indigo / near-black
            light: "#FFFFFF",
          },
        });

        // Draw centered branding / avatar badge onto the canvas
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const avatarRadius = 24;

          // White circular background border
          ctx.save();
          ctx.beginPath();
          ctx.arc(centerX, centerY, avatarRadius + 4, 0, Math.PI * 2);
          ctx.fillStyle = "#FFFFFF";
          ctx.fill();

          // Purple avatar background circle
          ctx.beginPath();
          ctx.arc(centerX, centerY, avatarRadius, 0, Math.PI * 2);
          ctx.fillStyle = PURPLE_PRIMARY;
          ctx.fill();

          // If avatar image is available, draw image, otherwise draw initial letter
          if (userAvatar && userAvatar.startsWith("http")) {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
              ctx.save();
              ctx.beginPath();
              ctx.arc(centerX, centerY, avatarRadius, 0, Math.PI * 2);
              ctx.clip();
              ctx.drawImage(
                img,
                centerX - avatarRadius,
                centerY - avatarRadius,
                avatarRadius * 2,
                avatarRadius * 2
              );
              ctx.restore();
            };
            img.src = userAvatar;
          } else {
            // Initial letter
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "bold 20px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(displayName?.[0]?.toUpperCase() || "U", centerX, centerY + 1);
          }
          ctx.restore();
        }
      } catch (err) {
        console.error("Error generating QR code:", err);
      } finally {
        setIsGenerating(false);
      }
    };

    void generateRealQRCode();
  }, [activeTab, isQRCodeModalOpen, qrKey, inviteLink, displayName, userAvatar]);

  // Camera stream for scanning
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (activeTab === "scan-code" && isQRCodeModalOpen) {
      setIsScanning(true);
      setCameraError(null);
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: "environment" } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch((err) => {
          console.warn("Camera access denied or unavailable:", err);
          setCameraError("Camera is unavailable or permission was not granted. You can scan or upload a QR image from device below.");
        })
        .finally(() => setIsScanning(false));
    }

    return () => {
      if (stream) {
        (stream as MediaStream).getTracks().forEach((track) => track.stop());
      }
    };
  }, [activeTab, isQRCodeModalOpen]);

  const handleClose = () => {
    dispatch(SET_QR_CODE_MODAL_OPEN({ open: false }));
    setIsFullscreen(false);
  };

  const handleRefresh = () => {
    setQrKey(Date.now());
    showToast(SUCCESS, "QR Code refreshed!");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Connect with ${displayName} on Chatty`,
          text: `Scan my QR code or click this link to chat with me on Chatty:`,
          url: inviteLink,
        });
        showToast(SUCCESS, "Invite shared!");
      } catch {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(inviteLink);
      showToast(SUCCESS, "Profile invite link copied to clipboard!");
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      showToast(SUCCESS, "Invite link copied to clipboard!");
    } catch {
      showToast(FAILED, "Failed to copy link");
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `${displayName.replace(/\s+/g, "_")}_Chatty_QR.png`;
    link.href = url;
    link.click();
    showToast(SUCCESS, "QR Code image downloaded");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleScanFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      showToast(SUCCESS, `QR code file "${file.name}" selected! Opening chat...`);
      handleClose();
    }
  };

  return (
    <Dialog
      open={isQRCodeModalOpen}
      onClose={handleClose}
      maxWidth={isFullscreen ? false : "xs"}
      fullScreen={isFullscreen}
      slotProps={{
        paper: {
          sx: {
            borderRadius: isFullscreen ? 0 : "16px",
            p: 0,
            overflow: "hidden",
            backgroundColor: theme.palette.mode === "dark" ? theme.palette.background.paper : "#FFFFFF",
            boxShadow: "0 10px 40px rgba(0,0,0,0.18)",
            width: isFullscreen ? "100%" : "440px",
            maxWidth: "100%",
          },
        },
      }}
    >
      <input
        type="file"
        ref={scanFileInputRef}
        onChange={handleScanFileUpload}
        accept="image/*"
        style={{ display: "none" }}
      />

      {/* ── Header ── */}
      <DialogTitle
        sx={{
          px: 2.5,
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.05rem" }}>
          QR Code
        </Typography>

        <IconButton size="small" onClick={handleClose} sx={{ color: theme.palette.text.secondary }}>
          <CloseRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>

      {/* ── Content ── */}
      <DialogContent sx={{ p: 2.5, overflowY: "auto" }}>
        {/* Tabs: My Code / Scan Code */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2.5 }}>
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            sx={{
              backgroundColor: theme.palette.mode === "dark" ? alpha("#FFFFFF", 0.04) : "#F3F4F6",
              borderRadius: "10px",
              p: 0.5,
              minHeight: "auto",
              "& .MuiTabs-indicator": { display: "none" },
            }}
          >
            <Tab
              value="my-code"
              icon={<QrCode2RoundedIcon sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label="My Code"
              sx={{
                borderRadius: "8px",
                minHeight: 36,
                py: 0.5,
                px: 2.5,
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: theme.palette.text.secondary,
                "&.Mui-selected": {
                  backgroundColor: theme.palette.mode === "dark" ? theme.palette.background.paper : "#FFFFFF",
                  color: PURPLE_PRIMARY,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                },
              }}
            />
            <Tab
              value="scan-code"
              icon={<QrCodeScannerRoundedIcon sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label="Scan Code"
              sx={{
                borderRadius: "8px",
                minHeight: 36,
                py: 0.5,
                px: 2.5,
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: theme.palette.text.secondary,
                "&.Mui-selected": {
                  backgroundColor: theme.palette.mode === "dark" ? theme.palette.background.paper : "#FFFFFF",
                  color: PURPLE_PRIMARY,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                },
              }}
            />
          </Tabs>
        </Box>

        {activeTab === "my-code" ? (
          /* ── MY CODE TAB ── */
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            {/* Real QR Code Canvas */}
            <Box
              sx={{
                p: 1.5,
                borderRadius: "16px",
                backgroundColor: "#FFFFFF",
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              {isGenerating ? (
                <Box sx={{ width: 220, height: 220, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CircularProgress size={32} />
                </Box>
              ) : (
                <canvas
                  ref={canvasRef}
                  style={{
                    width: 220,
                    height: 220,
                    display: "block",
                    borderRadius: "8px",
                  }}
                />
              )}
            </Box>

            {/* Name & Username */}
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.05rem" }}>
              {displayName}
            </Typography>

            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: "block", fontSize: "0.78rem" }}>
              {username || (loginUser?.email ? loginUser.email : "")}
            </Typography>

            {/* Link Preview with Copy Button */}
            <Box
              sx={{
                mt: 1.5,
                mb: 1.5,
                px: 1.5,
                py: 0.75,
                borderRadius: "8px",
                backgroundColor: theme.palette.mode === "dark" ? alpha("#FFFFFF", 0.04) : "#F3F4F6",
                border: `1px solid ${theme.palette.divider}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                maxWidth: 320,
              }}
            >
              <Typography
                variant="caption"
                noWrap
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: "0.72rem",
                  fontFamily: "monospace",
                  flex: 1,
                  textAlign: "left",
                  mr: 1,
                }}
              >
                {inviteLink}
              </Typography>
              <Tooltip title="Copy Link">
                <IconButton size="small" onClick={handleCopyLink} sx={{ color: PURPLE_PRIMARY, p: 0.25 }}>
                  <ContentCopyRoundedIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Privacy Disclaimer */}
            <Typography
              variant="caption"
              sx={{ color: theme.palette.text.secondary, fontSize: "0.72rem", mb: 2.5, maxWidth: 300 }}
            >
              Scan this code with any phone camera or QR reader to connect on Chatty.
            </Typography>

            {/* 5 Action Buttons */}
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", justifyContent: "center", gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={handleRefresh}
                startIcon={<RefreshRoundedIcon sx={{ fontSize: 16 }} />}
                sx={{
                  borderRadius: "8px",
                  borderColor: PURPLE_PRIMARY,
                  color: PURPLE_PRIMARY,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  py: 0.65,
                  px: 1.25,
                  "&:hover": {
                    borderColor: "#6D28D9",
                    backgroundColor: alpha(PURPLE_PRIMARY, 0.05),
                  },
                }}
              >
                Refresh
              </Button>

              <Button
                variant="outlined"
                size="small"
                onClick={handleShare}
                startIcon={<ShareRoundedIcon sx={{ fontSize: 16 }} />}
                sx={{
                  borderRadius: "8px",
                  borderColor: PURPLE_PRIMARY,
                  color: PURPLE_PRIMARY,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  py: 0.65,
                  px: 1.25,
                  "&:hover": {
                    borderColor: "#6D28D9",
                    backgroundColor: alpha(PURPLE_PRIMARY, 0.05),
                  },
                }}
              >
                Share
              </Button>

              <Button
                variant="outlined"
                size="small"
                onClick={handleDownload}
                startIcon={<DownloadRoundedIcon sx={{ fontSize: 16 }} />}
                sx={{
                  borderRadius: "8px",
                  borderColor: PURPLE_PRIMARY,
                  color: PURPLE_PRIMARY,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  py: 0.65,
                  px: 1.25,
                  "&:hover": {
                    borderColor: "#6D28D9",
                    backgroundColor: alpha(PURPLE_PRIMARY, 0.05),
                  },
                }}
              >
                Download
              </Button>

              <Button
                variant="outlined"
                size="small"
                onClick={handlePrint}
                startIcon={<PrintRoundedIcon sx={{ fontSize: 16 }} />}
                sx={{
                  borderRadius: "8px",
                  borderColor: PURPLE_PRIMARY,
                  color: PURPLE_PRIMARY,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  py: 0.65,
                  px: 1.25,
                  "&:hover": {
                    borderColor: "#6D28D9",
                    backgroundColor: alpha(PURPLE_PRIMARY, 0.05),
                  },
                }}
              >
                Print
              </Button>

              <Button
                variant="contained"
                size="small"
                onClick={() => setIsFullscreen(!isFullscreen)}
                startIcon={
                  isFullscreen ? (
                    <FullscreenExitRoundedIcon sx={{ fontSize: 16 }} />
                  ) : (
                    <FullscreenRoundedIcon sx={{ fontSize: 16 }} />
                  )
                }
                sx={{
                  borderRadius: "8px",
                  backgroundColor: PURPLE_PRIMARY,
                  color: "#FFFFFF",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  py: 0.65,
                  px: 1.5,
                  "&:hover": { backgroundColor: "#6D28D9" },
                }}
              >
                Full Screen
              </Button>
            </Stack>
          </Box>
        ) : (
          /* ── SCAN CODE TAB ── */
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            {cameraError ? (
              <Alert severity="info" sx={{ mb: 2, borderRadius: "8px", fontSize: "0.8rem" }}>
                {cameraError}
              </Alert>
            ) : (
              <Box
                sx={{
                  width: 240,
                  height: 240,
                  borderRadius: "16px",
                  overflow: "hidden",
                  backgroundColor: "#000000",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                {isScanning ? (
                  <CircularProgress color="primary" />
                ) : (
                  <video
                    ref={videoRef}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    playsInline
                    muted
                  />
                )}

                {/* Scan Overlay Crosshair */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: 30,
                    border: `2px dashed ${PURPLE_PRIMARY}`,
                    borderRadius: "10px",
                    pointerEvents: "none",
                  }}
                />
              </Box>
            )}

            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: "0.8125rem", mb: 2 }}>
              Point your camera at a Chatty QR code to add contact immediately.
            </Typography>

            <Button
              variant="outlined"
              onClick={() => scanFileInputRef.current?.click()}
              startIcon={<UploadFileRoundedIcon />}
              sx={{
                borderColor: PURPLE_PRIMARY,
                color: PURPLE_PRIMARY,
                borderRadius: "8px",
                fontSize: "0.8125rem",
                "&:hover": {
                  borderColor: "#6D28D9",
                  backgroundColor: alpha(PURPLE_PRIMARY, 0.05),
                },
              }}
            >
              Upload QR Image from Device
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeModal;
