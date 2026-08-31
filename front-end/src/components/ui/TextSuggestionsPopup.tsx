/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from "react";
import { Box, Paper, Stack, Typography, alpha } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";
import SpellcheckRoundedIcon from "@mui/icons-material/SpellcheckRounded";
import ShortcutRoundedIcon from "@mui/icons-material/ShortcutRounded";
import type { SmartSuggestion } from "../../utils/smartSuggest/useSmartSuggestions";

/**
 * Small, clean suggestion popup rendered near the text cursor.
 * Rendered inside an absolutely-positioned anchor container (position:relative)
 * so coordinates from the hook are applied directly.
 */
export interface TextSuggestionsPopupProps {
  /** suggestion list from useSmartSuggestions */
  items: SmartSuggestion[];
  activeIndex: number;
  position: { top: number; left: number } | null;
  onApply: (index: number) => void;
}

const KIND_ICON: Record<SmartSuggestion["kind"], ReactNode> = {
  completion: <ShortcutRoundedIcon sx={{ fontSize: 16 }} />,
  spelling: <SpellcheckRoundedIcon sx={{ fontSize: 16 }} />,
  grammar: <AutoFixHighRoundedIcon sx={{ fontSize: 16 }} />,
};

const KIND_COLOR: Record<SmartSuggestion["kind"], string | undefined> = {
  completion: undefined, // inherits
  spelling: "#F59E0B",
  grammar: "#3B82F6",
};

const KIND_TAG: Record<SmartSuggestion["kind"], string> = {
  completion: "Complete",
  spelling: "Spelling",
  grammar: "Grammar",
};

const TextSuggestionsPopup = ({
  items,
  activeIndex,
  position,
  onApply,
}: TextSuggestionsPopupProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  if (!items.length || !position) return null;

  return (
    <Paper
      elevation={0}
      onMouseDown={(e) => e.preventDefault()} // keep input focus while clicking
      sx={{
        position: "absolute",
        zIndex: 90,
        minWidth: 228,
        maxWidth: 300,
        borderRadius: 2,
        py: 0.5,
        backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: `0 12px 32px ${alpha(isDark ? "#000000" : "#111827", isDark ? 0.5 : 0.16)}`,
        transform: "translateY(-100%)",
        top: position.top,
        left: position.left,
        overflow: "hidden",
      }}
    >
      {items.map((item, index) => {
        const isActive = index === activeIndex;
        return (
          <Stack
            key={item.id}
            direction="row"
            spacing={1}
            role="option"
            aria-selected={isActive}
            onClick={() => onApply(index)}
            sx={{
              alignItems: "center",
              px: 1.5,
              py: 0.85,
              cursor: "pointer",
              backgroundColor: isActive
                ? alpha(theme.palette.primary.main, isDark ? 0.18 : 0.1)
                : "transparent",
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, isDark ? 0.14 : 0.08),
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 26,
                height: 26,
                borderRadius: "7px",
                flexShrink: 0,
                color: KIND_COLOR[item.kind] || (isActive ? "#FFFFFF" : theme.palette.text.secondary),
                backgroundColor: isActive
                  ? alpha(theme.palette.primary.main, 0.9)
                  : alpha(theme.palette.text.primary, 0.05),
              }}
            >
              {KIND_ICON[item.kind]}
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="body2"
                noWrap
                sx={{ fontWeight: 600, fontSize: "0.82rem", lineHeight: 1.25 }}
              >
                {item.label}
              </Typography>
              {item.detail && (
                <Typography
                  variant="caption"
                  noWrap
                  sx={{
                    display: "block",
                    fontSize: "0.62rem",
                    color: theme.palette.text.secondary,
                  }}
                >
                  {KIND_TAG[item.kind]} · {item.detail}
                </Typography>
              )}
            </Box>
            {isActive && (
              <Typography variant="caption" sx={{ fontSize: "0.62rem", color: theme.palette.text.secondary }}>
                ↵
              </Typography>
            )}
          </Stack>
        );
      })}

      <Box
        sx={{
          px: 1.5,
          py: 0.6,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.55)}`,
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        <Typography variant="caption" sx={{ fontSize: "0.6rem", color: theme.palette.text.secondary }}>
          ↑↓ navigate · ↵ apply · Esc close
        </Typography>
      </Box>
    </Paper>
  );
};

export default TextSuggestionsPopup;