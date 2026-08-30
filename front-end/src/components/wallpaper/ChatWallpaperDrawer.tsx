import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Button,
  Stack,
  Tooltip,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

import { RootState } from "../../redux/store";
import {
  SET_WALLPAPER_PANEL_OPEN,
  APPLY_WALLPAPER,
  RESET_WALLPAPER,
  SET_WALLPAPER_PREVIEW,
  SET_WALLPAPER_CATEGORY,
} from "../../redux/features/settings/settingsSlice";
import {
  ALL_WALLPAPERS,
  SOLID_WALLPAPERS,
  LIGHT_WALLPAPERS,
  PATTERN_WALLPAPERS,
  WallpaperOption,
} from "../../constants/wallpapers";
import { PURPLE_PRIMARY } from "../../theme";
import { showToast } from "../../utils/toast";
import { SUCCESS } from "../../constants/common";
import { persistUserSettings } from "../../utils/userSettings";

export const ChatWallpaperDrawer: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { isWallpaperPanelOpen, wallpaperId, previewWallpaperId, wallpaperCategory } =
    useSelector((state: RootState) => state.settings);

  const [searchQuery, setSearchQuery] = useState("");

  const activeSelectedId = previewWallpaperId || wallpaperId;

  const categories: { label: string; value: "all" | "solid" | "light" | "patterns" }[] = [
    { label: "All", value: "all" },
    { label: "Solid Colors", value: "solid" },
    { label: "Light", value: "light" },
    { label: "Patterns", value: "patterns" },
  ];

  const currentCategoryList: WallpaperOption[] = useMemo(() => {
    switch (wallpaperCategory) {
      case "solid":
        return SOLID_WALLPAPERS;
      case "light":
        return LIGHT_WALLPAPERS;
      case "patterns":
        return PATTERN_WALLPAPERS;
      case "all":
      default:
        return ALL_WALLPAPERS;
    }
  }, [wallpaperCategory]);

  const filteredWallpapers = useMemo(() => {
    return currentCategoryList.filter((wp) => {
      if (!searchQuery.trim()) return true;
      return wp.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [currentCategoryList, searchQuery]);

  const handleClose = () => {
    dispatch(SET_WALLPAPER_PANEL_OPEN(false));
    dispatch(SET_WALLPAPER_PREVIEW(null));
  };

  const handleSelectWallpaper = (wp: WallpaperOption) => {
    dispatch(SET_WALLPAPER_PREVIEW(wp.id));
  };

  const handleApplyWallpaper = () => {
    const selected = ALL_WALLPAPERS.find((w) => w.id === activeSelectedId);
    if (selected) {
      dispatch(APPLY_WALLPAPER(selected.id));
      void persistUserSettings({ wallpaper_id: selected.id, wallpaper_category: wallpaperCategory });
      showToast(SUCCESS, `Applied "${selected.name}" wallpaper!`);
      handleClose();
    }
  };

  const handleResetToDefault = () => {
    dispatch(RESET_WALLPAPER());
    dispatch(SET_WALLPAPER_PREVIEW("default"));
    void persistUserSettings({ wallpaper_id: "default", wallpaper_category: "all" });
    showToast(SUCCESS, "Reset chat wallpaper to default!");
  };

  const getWallpaperPreviewStyle = (wp: WallpaperOption) => {
    if (wp.previewColor) {
      return { backgroundColor: wp.previewColor };
    }
    if (wp.previewGradient) {
      return { backgroundImage: wp.previewGradient };
    }
    return wp.cssStyle;
  };

  return (
    <Drawer
      anchor="right"
      open={isWallpaperPanelOpen}
      onClose={handleClose}
      variant="temporary"
      slotProps={{
        paper: {
          sx: {
            width: { xs: "100%", sm: 380, md: 420 },
            maxWidth: "100%",
            backgroundColor: theme.palette.mode === "dark" ? theme.palette.background.paper : "#FFFFFF",
            borderLeft: `1px solid ${theme.palette.divider}`,
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
          },
        },
      }}
    >
      {/* ── Top Header ── */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
          Chat Wallpaper
        </Typography>

        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Tooltip title="Reset to default">
            <Button
              size="small"
              onClick={handleResetToDefault}
              startIcon={<RestartAltRoundedIcon sx={{ fontSize: 16 }} />}
              sx={{
                fontSize: "0.75rem",
                color: theme.palette.text.secondary,
                "&:hover": { color: PURPLE_PRIMARY },
              }}
            >
              Reset
            </Button>
          </Tooltip>

          <IconButton size="small" onClick={handleClose} sx={{ color: theme.palette.text.secondary }}>
            <CloseRoundedIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Stack>
      </Box>

      {/* ── Search & Categories ── */}
      <Box sx={{ px: 2.5, pt: 2, pb: 1.5 }}>
        {/* Search */}
        <TextField
          fullWidth
          size="small"
          placeholder="Search wallpapers"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <SearchRoundedIcon sx={{ color: theme.palette.text.secondary, fontSize: 18 }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            mb: 1.5,
            "& .MuiOutlinedInput-root": {
              backgroundColor: theme.palette.mode === "dark" ? alpha("#FFFFFF", 0.05) : "#F8F9FB",
              borderRadius: "10px",
              height: 38,
              fontSize: "0.8125rem",
            },
          }}
        />

        {/* Category Chips */}
        <Stack direction="row" spacing={1} sx={{ overflowX: "auto", pb: 0.5 }}>
          {categories.map((cat) => {
            const isSelected = wallpaperCategory === cat.value;
            return (
              <Chip
                key={cat.value}
                label={cat.label}
                onClick={() => dispatch(SET_WALLPAPER_CATEGORY(cat.value))}
                sx={{
                  borderRadius: "8px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  height: 30,
                  cursor: "pointer",
                  backgroundColor: isSelected ? PURPLE_PRIMARY : theme.palette.mode === "dark" ? alpha("#FFFFFF", 0.05) : "#F3F4F6",
                  color: isSelected ? "#FFFFFF" : theme.palette.text.secondary,
                  "&:hover": {
                    backgroundColor: isSelected ? PURPLE_PRIMARY : alpha(PURPLE_PRIMARY, 0.08),
                  },
                }}
              />
            );
          })}
        </Stack>
      </Box>

      {/* ── Grid of Wallpapers ── */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 2.5,
          py: 1,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 1.5,
          alignContent: "flex-start",
        }}
      >
        {filteredWallpapers.map((wp) => {
          const isSelected = activeSelectedId === wp.id;
          return (
            <Box
              key={wp.id}
              onClick={() => handleSelectWallpaper(wp)}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
                gap: 0.75,
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  aspectRatio: "3 / 4",
                  borderRadius: "10px",
                  border: isSelected
                    ? `2.5px solid ${PURPLE_PRIMARY}`
                    : `1px solid ${theme.palette.divider}`,
                  boxShadow: isSelected ? `0 0 0 3px ${alpha(PURPLE_PRIMARY, 0.25)}` : "none",
                  position: "relative",
                  overflow: "hidden",
                  transition: "all 150ms ease",
                  ...getWallpaperPreviewStyle(wp),
                  "&:hover": {
                    transform: "translateY(-2px)",
                    borderColor: PURPLE_PRIMARY,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  },
                }}
              >
                {isSelected && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      backgroundColor: PURPLE_PRIMARY,
                      color: "#FFFFFF",
                      borderRadius: "50%",
                      width: 20,
                      height: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    }}
                  >
                    <CheckRoundedIcon sx={{ fontSize: 14 }} />
                  </Box>
                )}
              </Box>

              <Typography
                noWrap
                variant="caption"
                sx={{
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: "0.7rem",
                  color: isSelected ? PURPLE_PRIMARY : theme.palette.text.primary,
                  textAlign: "center",
                  maxWidth: "100%",
                }}
              >
                {wp.name}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* ── Sticky Bottom Footer ── */}
      <Box
        sx={{
          p: 2,
          px: 2.5,
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.mode === "dark" ? theme.palette.background.paper : "#FFFFFF",
          display: "flex",
          gap: 1.5,
        }}
      >
        <Button
          fullWidth
          variant="outlined"
          onClick={handleResetToDefault}
          sx={{
            py: 1,
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
          Reset to Default
        </Button>

        <Button
          fullWidth
          variant="contained"
          onClick={handleApplyWallpaper}
          sx={{
            py: 1,
            borderRadius: "8px",
            backgroundColor: PURPLE_PRIMARY,
            color: "#FFFFFF",
            fontSize: "0.8125rem",
            fontWeight: 600,
            "&:hover": { backgroundColor: "#6D28D9" },
          }}
        >
          Apply Wallpaper
        </Button>
      </Box>
    </Drawer>
  );
};

export default ChatWallpaperDrawer;
