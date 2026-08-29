/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onClose: () => void;
  loading?: boolean;
  danger?: boolean;
  icon?: ReactNode;
}

/**
 * Reusable, modern confirmation dialog.
 * Escape key + backdrop click close via Dialog `onClose`.
 * Cancel is auto-focused for safe keyboard flow.
 */
const ConfirmModal = ({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onClose,
  loading = false,
  danger = false,
  icon,
}: ConfirmModalProps) => {
  const theme = useTheme();
  const toneColor = danger ? theme.palette.error.main : theme.palette.primary.main;

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{ paper: { elevation: 0 } }}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <Box sx={{ p: { xs: 2.5, sm: 3.5 }, textAlign: "center" }}>
        <Box
          sx={{
            width: 58,
            height: 58,
            mx: "auto",
            mb: 2,
            borderRadius: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: alpha(toneColor, 0.14),
            color: toneColor,
            border: `1px solid ${alpha(toneColor, 0.25)}`,
          }}
        >
          {icon || <WarningAmberRoundedIcon sx={{ fontSize: 30 }} />}
        </Box>

        <Typography
          id="confirm-dialog-title"
          variant="h6"
          sx={{ fontWeight: 700, mb: 1 }}
        >
          {title}
        </Typography>

        {description && (
          <Typography
            id="confirm-dialog-description"
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: 1.6, mb: 3 }}
          >
            {description}
          </Typography>
        )}

        <DialogActions sx={{ px: 0, pb: 0, justifyContent: "center", gap: 1, flexWrap: "no-wrap" }}>
          <Button
            onClick={onClose}
            disabled={loading}
            variant="outlined"
            autoFocus
            sx={{ minWidth: 110 }}
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            variant="contained"
            sx={{
              minWidth: 110,
              backgroundColor: danger ? toneColor : undefined,
              "&:hover": danger
                ? { backgroundColor: alpha(toneColor, 0.85) }
                : undefined,
            }}
          >
            {loading ? <CircularProgress size={18} color="inherit" /> : confirmText}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ConfirmModal;