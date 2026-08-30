import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";

import { RootState } from "../../redux/store";
import {
  SET_DISAPPEARING_MODAL_OPEN,
  SET_DISAPPEARING_MESSAGES,
  DisappearingOption,
} from "../../redux/features/settings/settingsSlice";
import { PURPLE_PRIMARY } from "../../theme";
import { showToast } from "../../utils/toast";
import { SUCCESS } from "../../constants/common";
import { persistUserSettings } from "../../utils/userSettings";

export const DisappearingMessagesModal: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { isDisappearingModalOpen, disappearingMessages } = useSelector(
    (state: RootState) => state.settings
  );

  const [selectedTimer, setSelectedTimer] = useState<DisappearingOption>(disappearingMessages);

  const handleClose = () => {
    dispatch(SET_DISAPPEARING_MODAL_OPEN(false));
  };

  const handleSave = () => {
    dispatch(SET_DISAPPEARING_MESSAGES(selectedTimer));
    void persistUserSettings({ disappearing_messages: selectedTimer });
    showToast(
      SUCCESS,
      selectedTimer === "off"
        ? "Disappearing messages turned off."
        : `Messages will disappear after ${
            selectedTimer === "24h"
              ? "24 hours"
              : selectedTimer === "7d"
              ? "7 days"
              : "30 days"
          }.`
    );
    handleClose();
  };

  const options: { id: DisappearingOption; label: string; desc: string }[] = [
    { id: "24h", label: "24 Hours", desc: "Messages will disappear 24 hours after being sent." },
    { id: "7d", label: "7 Days", desc: "Messages will disappear 7 days after being sent." },
    { id: "30d", label: "30 Days", desc: "Messages will disappear 30 days after being sent." },
    { id: "off", label: "Off", desc: "Messages stay in chat permanently." },
  ];

  return (
    <Dialog
      open={isDisappearingModalOpen}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: "16px",
            p: 0,
            overflow: "hidden",
            backgroundColor: theme.palette.mode === "dark" ? theme.palette.background.paper : "#FFFFFF",
            boxShadow: "0 10px 40px rgba(0,0,0,0.18)",
          },
        },
      }}
    >
      {/* Header */}
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AccessTimeRoundedIcon sx={{ color: PURPLE_PRIMARY, fontSize: 20 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.05rem" }}>
            Disappearing Messages
          </Typography>
        </Box>

        <IconButton size="small" onClick={handleClose} sx={{ color: theme.palette.text.secondary }}>
          <CloseRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ p: 2.5 }}>
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: "0.8125rem", mb: 2 }}>
          When turned on, new messages sent in this conversation will disappear after the selected duration.
        </Typography>

        <RadioGroup
          value={selectedTimer}
          onChange={(e) => setSelectedTimer(e.target.value as DisappearingOption)}
        >
          {options.map((opt) => {
            const isSelected = selectedTimer === opt.id;
            return (
              <Paper
                key={opt.id}
                elevation={0}
                onClick={() => setSelectedTimer(opt.id)}
                sx={{
                  p: 1.5,
                  mb: 1.25,
                  borderRadius: "10px",
                  border: `1.5px solid ${isSelected ? PURPLE_PRIMARY : theme.palette.divider}`,
                  backgroundColor: isSelected
                    ? alpha(PURPLE_PRIMARY, 0.04)
                    : theme.palette.mode === "dark"
                    ? alpha("#FFFFFF", 0.02)
                    : "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  transition: "all 150ms ease",
                  "&:hover": {
                    borderColor: PURPLE_PRIMARY,
                  },
                }}
              >
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: "0.85rem", color: theme.palette.text.primary }}>
                    {opt.label}
                  </Typography>
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: "0.72rem" }}>
                    {opt.desc}
                  </Typography>
                </Box>

                <FormControlLabel
                  value={opt.id}
                  control={<Radio size="small" sx={{ "&.Mui-checked": { color: PURPLE_PRIMARY }, p: 0.5 }} />}
                  label=""
                  sx={{ m: 0 }}
                />
              </Paper>
            );
          })}
        </RadioGroup>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ px: 2.5, pb: 2.5, pt: 1, gap: 1.5 }}>
        <Button
          variant="outlined"
          onClick={handleClose}
          sx={{
            flex: 1,
            py: 0.85,
            borderRadius: "8px",
            borderColor: PURPLE_PRIMARY,
            color: PURPLE_PRIMARY,
            fontSize: "0.8125rem",
            fontWeight: 600,
            "&:hover": {
              borderColor: "#6D28D9",
              backgroundColor: alpha(PURPLE_PRIMARY, 0.05),
            },
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          sx={{
            flex: 1,
            py: 0.85,
            borderRadius: "8px",
            backgroundColor: PURPLE_PRIMARY,
            color: "#FFFFFF",
            fontSize: "0.8125rem",
            fontWeight: 600,
            "&:hover": { backgroundColor: "#6D28D9" },
          }}
        >
          Save Timer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DisappearingMessagesModal;
