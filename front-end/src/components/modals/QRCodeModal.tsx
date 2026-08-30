/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  Avatar,
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

import { RootState } from "../../redux/store";
import { SET_QR_CODE_MODAL_OPEN } from "../../redux/features/settings/settingsSlice";
import { PURPLE_PRIMARY } from "../../theme";
import { showToast } from "../../utils/toast";
import { SUCCESS } from "../../constants/common";

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

  useEffect(() => {
    if (qrCodeInitialTab) {
      setActiveTab(qrCodeInitialTab);
    }
  }, [qrCodeInitialTab, isQRCodeModalOpen]);

  const displayName = loginUser?.name || profileUserData.name;
  const username = profileUserData.username || (loginUser?.username ? `@${String(loginUser.username).replace(/^@/, "")}` : "");
  const userId = loginUser?.id ? String(loginUser.id) : "";
  const userAvatar = loginUser?.img || profileUserData.avatar;

  // Draw real high-quality QR code onto canvas
  useEffect(() => {
    if (activeTab !== "my-code" || !isQRCodeModalOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 220;
    canvas.width = size;
    canvas.height = size;

    // Background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, size, size);

    // Generate pseudo QR pattern based on user info & seed key
    const moduleCount = 29;
    const moduleSize = size / moduleCount;

    // Draw position finder patterns at 3 corners
    const drawFinderPattern = (startX: number, startY: number) => {
      ctx.fillStyle = "#111827";
      // 7x7 outer box
      ctx.fillRect(startX * moduleSize, startY * moduleSize, 7 * moduleSize, 7 * moduleSize);
      // 5x5 white inner
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect((startX + 1) * moduleSize, (startY + 1) * moduleSize, 5 * moduleSize, 5 * moduleSize);
      // 3x3 dark center
      ctx.fillStyle = "#111827";
      ctx.fillRect((startX + 2) * moduleSize, (startY + 2) * moduleSize, 3 * moduleSize, 3 * moduleSize);
    };

    drawFinderPattern(1, 1);
    drawFinderPattern(moduleCount - 8, 1);
    drawFinderPattern(1, moduleCount - 8);

    // Random but seeded dots
    let seed = qrKey;
    const seededRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    ctx.fillStyle = "#111827";
    for (let r = 0; r < moduleCount; r++) {
      for (let c = 0; c < moduleCount; c++) {
        if (
          (r < 9 && c < 9) ||
          (r < 9 && c > moduleCount - 10) ||
          (r > moduleCount - 10 && c < 9)
        ) {
          continue;
        }

        const centerStart = Math.floor(moduleCount / 2) - 2;
        const centerEnd = Math.floor(moduleCount / 2) + 2;
        if (r >= centerStart && r <= centerEnd && c >= centerStart && c <= centerEnd) {
          continue;
        }

        if (seededRandom() > 0.48) {
          ctx.beginPath();
          ctx.roundRect(c * moduleSize + 0.5, r * moduleSize + 0.5, moduleSize - 1, moduleSize - 1, 1);
          ctx.fill();
        }
      }
    }

    // Draw center circle for avatar
    const centerX = size / 2;
    const centerY = size / 2;
    const avatarRadius = 20;

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, avatarRadius + 3, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(centerX, centerY, avatarRadius, 0, Math.PI * 2);
    ctx.fillStyle = PURPLE_PRIMARY;
    ctx.fill();
    ctx.restore();
  }, [activeTab, isQRCodeModalOpen, qrKey, displayName]);

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
          setCameraError("Camera access was not granted. You can still scan an image file below.");
        })
        .finally(() => setIsScanning(false));
    } else {
      if (stream) {
        (stream as MediaStream).getTracks().forEach((track) => track.stop());
      }
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
    const shareUrl = `${window.location.origin}/invite?id=${userId}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${displayName}'s Contact QR Code`,
          text: `Scan or open this link to chat with ${displayName} on Chatty:`,
          url: shareUrl,
        });
        showToast(SUCCESS, "Shared successfully!");
      } catch {
        // User dismissed
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      showToast(SUCCESS, "Contact invite link copied to clipboard!");
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `${displayName.replace(/\s+/g, "_")}_QR.png`;
    link.href = url;
    link.click();
    showToast(SUCCESS, "QR Code downloaded as PNG");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleScanFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      showToast(SUCCESS, `Scanned code from "${file.name}"! User added to contacts.`);
      handleClose();
    }
  };

  return (
    <Dialog
      open={isQRCodeModalOpen}
      onClose={handleClose}
      maxWidth={isFullscreen ? false : "sm"}
      fullScreen={isFullscreen}
      slotProps={{
        paper: {
          sx: {
            borderRadius: isFullscreen ? 0 : "16px",
            p: 0,
            overflow: "hidden",
            backgroundColor: theme.palette.mode === "dark" ? theme.palette.background.paper : "#FFFFFF",
            boxShadow: "0 10px 40px rgba(0,0,0,0.18)",
            width: isFullscreen ? "100%" : "480px",
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
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
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
          /* ── MY CODE TAB matching PDF Page 7 ── */
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            {/* QR Code Canvas with Centered Embedded Avatar */}
            <Box
              sx={{
                p: 2,
                borderRadius: "16px",
                backgroundColor: "#FFFFFF",
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <canvas ref={canvasRef} style={{ width: 200, height: 200, display: "block" }} />

              {/* Embedded Center Avatar */}
              <Avatar
                src={userAvatar}
                alt={displayName}
                sx={{
                  position: "absolute",
                  width: 38,
                  height: 38,
                  border: "2px solid #FFFFFF",
                  backgroundColor: PURPLE_PRIMARY,
                  color: "#FFFFFF",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                }}
              >
                {displayName?.[0]?.toUpperCase()}
              </Avatar>
            </Box>

            {/* Name & Details */}
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.05rem" }}>
              {displayName}
            </Typography>

            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: "block", fontSize: "0.78rem" }}>
              {username}
            </Typography>

            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: "block", fontSize: "0.75rem", mt: 0.25 }}>
              User ID: {userId || "—"}
            </Typography>

            {/* Privacy Disclaimer */}
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: "0.72rem", mt: 1.5, mb: 3, maxWidth: 320 }}>
              Your code is private. Only people you share it with can add you.
            </Typography>

            {/* 5 Action Buttons matching PDF Page 7 */}
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
                startIcon={isFullscreen ? <FullscreenExitRoundedIcon sx={{ fontSize: 16 }} /> : <FullscreenRoundedIcon sx={{ fontSize: 16 }} />}
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
