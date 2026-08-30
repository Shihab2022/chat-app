import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Select,
  MenuItem,
  FormControl,
  Switch,
  Divider,
  Stack,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import WallpaperRoundedIcon from "@mui/icons-material/WallpaperRounded";
import ViewHeadlineRoundedIcon from "@mui/icons-material/ViewHeadlineRounded";

import { RootState } from "../../redux/store";
import {
  SET_THEME,
  SET_FONT_SIZE,
  SET_COMPACT_LIST,
  SET_WALLPAPER_PANEL_OPEN,
  FontSizeOption,
  ThemeMode,
} from "../../redux/features/settings/settingsSlice";
import { PURPLE_PRIMARY } from "../../theme";
import { persistUserSettings } from "../../utils/userSettings";

interface Props {
  onBack: () => void;
}

export const AppearanceSidebar: React.FC<Props> = ({ onBack }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { theme: currentTheme, fontSize, compactList } = useSelector(
    (state: RootState) => state.settings
  );

  const handleThemeChange = (mode: ThemeMode) => {
    dispatch(SET_THEME(mode));
    void persistUserSettings({ theme: mode });
  };

  const handleFontSizeChange = (size: FontSizeOption) => {
    dispatch(SET_FONT_SIZE(size));
    void persistUserSettings({ font_size: size });
  };

  const handleCompactToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(SET_COMPACT_LIST(e.target.checked));
    void persistUserSettings({ compact_list: e.target.checked });
  };

  const handleOpenWallpaperPanel = () => {
    dispatch(SET_WALLPAPER_PANEL_OPEN(true));
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.mode === "dark" ? theme.palette.background.paper : "#F8F9FB",
        borderRight: `1px solid ${theme.palette.divider}`,
        overflow: "hidden",
      }}
    >
      {/* ── Top Header with Back Arrow ── */}
      <Box
        sx={{
          px: 2,
          py: 2,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <IconButton size="small" onClick={onBack} sx={{ color: theme.palette.text.primary }}>
          <ArrowBackRoundedIcon sx={{ fontSize: 20 }} />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.1rem", color: theme.palette.text.primary }}>
          Appearance
        </Typography>
      </Box>

      {/* ── Scrollable Appearance Content ── */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 2.5, pb: 3 }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            fontSize: "0.85rem",
            color: theme.palette.text.primary,
            mb: 1.5,
          }}
        >
          Appearance
        </Typography>

        {/* Appearance Settings Card matching PDF Page 9 */}
        <Box
          sx={{
            backgroundColor: theme.palette.mode === "dark" ? alpha("#FFFFFF", 0.02) : "#FFFFFF",
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: "12px",
            p: 2,
          }}
        >
          {/* Theme Row */}
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 600, display: "block", mb: 1 }}>
              Theme
            </Typography>
            <Stack direction="row" spacing={1.5}>
              <Button
                variant={currentTheme === "light" ? "contained" : "outlined"}
                size="small"
                onClick={() => handleThemeChange("light")}
                startIcon={<LightModeRoundedIcon sx={{ fontSize: 16 }} />}
                sx={{
                  flex: 1,
                  py: 0.85,
                  borderRadius: "8px",
                  fontSize: "0.8125rem",
                  backgroundColor: currentTheme === "light" ? PURPLE_PRIMARY : "transparent",
                  color: currentTheme === "light" ? "#FFFFFF" : PURPLE_PRIMARY,
                  borderColor: PURPLE_PRIMARY,
                  "&:hover": {
                    backgroundColor: currentTheme === "light" ? "#6D28D9" : alpha(PURPLE_PRIMARY, 0.08),
                    borderColor: "#6D28D9",
                  },
                }}
              >
                Light
              </Button>

              <Button
                variant={currentTheme === "dark" ? "contained" : "outlined"}
                size="small"
                onClick={() => handleThemeChange("dark")}
                startIcon={<DarkModeRoundedIcon sx={{ fontSize: 16 }} />}
                sx={{
                  flex: 1,
                  py: 0.85,
                  borderRadius: "8px",
                  fontSize: "0.8125rem",
                  backgroundColor: currentTheme === "dark" ? PURPLE_PRIMARY : "transparent",
                  color: currentTheme === "dark" ? "#FFFFFF" : PURPLE_PRIMARY,
                  borderColor: PURPLE_PRIMARY,
                  "&:hover": {
                    backgroundColor: currentTheme === "dark" ? "#6D28D9" : alpha(PURPLE_PRIMARY, 0.08),
                    borderColor: "#6D28D9",
                  },
                }}
              >
                Dark
              </Button>
            </Stack>
          </Box>

          <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />

          {/* Chat Font Size Dropdown */}
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 600, display: "block", mb: 1 }}>
              Chat Font Size
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={fontSize}
                onChange={(e) => handleFontSizeChange(e.target.value as FontSizeOption)}
                sx={{
                  borderRadius: "8px",
                  fontSize: "0.8125rem",
                  backgroundColor: theme.palette.mode === "dark" ? alpha("#FFFFFF", 0.05) : "#FFFFFF",
                  "& fieldset": { borderColor: theme.palette.divider },
                  "&:hover fieldset": { borderColor: PURPLE_PRIMARY },
                }}
              >
                <MenuItem value="small">Small</MenuItem>
                <MenuItem value="default">Default</MenuItem>
                <MenuItem value="large">Large</MenuItem>
                <MenuItem value="extra-large">Extra Large</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />

          {/* Chat Wallpaper Row */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              py: 0.5,
              mb: 2.5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
              <WallpaperRoundedIcon sx={{ fontSize: 18, color: theme.palette.text.secondary }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: "0.85rem" }}>
                Chat Wallpaper
              </Typography>
            </Box>

            <Button
              variant="outlined"
              size="small"
              onClick={handleOpenWallpaperPanel}
              sx={{
                borderColor: PURPLE_PRIMARY,
                color: PURPLE_PRIMARY,
                fontSize: "0.75rem",
                fontWeight: 600,
                py: 0.5,
                px: 1.5,
                borderRadius: "6px",
                "&:hover": {
                  borderColor: "#6D28D9",
                  backgroundColor: alpha(PURPLE_PRIMARY, 0.08),
                },
              }}
            >
              Change
            </Button>
          </Box>

          <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />

          {/* Compact List Switch */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              py: 0.5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
              <ViewHeadlineRoundedIcon sx={{ fontSize: 18, color: theme.palette.text.secondary }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: "0.85rem" }}>
                Compact List
              </Typography>
            </Box>

            <Switch
              checked={compactList}
              onChange={handleCompactToggle}
              size="small"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AppearanceSidebar;
