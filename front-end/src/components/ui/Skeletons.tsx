import { Box, Skeleton, Stack, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

const shimmer = {
  borderRadius: 2,
  backgroundColor: "rgba(255,255,255,0.07)",
};

/**
 * Conversation list skeleton rows.
 */
export const ChatListSkeleton = ({ rows = 8 }: { rows?: number }) => (
  <Box sx={{ px: 1.5, py: 1 }}>
    {Array.from({ length: rows }).map((_, index) => (
      <Stack key={index} direction="row" spacing={1.5} sx={{ p: 1, my: 0.5 }}>
        <Skeleton variant="circular" width={44} height={44} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Skeleton variant="text" width="55%" height={14} />
          <Skeleton variant="text" width="85%" height={12} />
        </Box>
        <Skeleton variant="text" width={34} height={12} />
      </Stack>
    ))}
  </Box>
);

/**
 * Message thread skeleton.
 */
export const MessageSkeleton = () => {
  const theme = useTheme();
  return (
    <Box sx={{ px: { xs: 2, sm: 4 }, py: 2, width: "100%", maxWidth: 860, mx: "auto" }}>
      <Stack sx={{ alignItems: "center", my: 2 }}>
        <Skeleton variant="rounded" width={130} height={26} sx={{ borderRadius: 999 }} />
      </Stack>
      {[0, 1, 2, 3].map((item) => {
        const isOwn = item % 2 === 0;
        return (
          <Stack
            key={item}
            direction={isOwn ? "row-reverse" : "row"}
            spacing={1}
            sx={{ mb: 2, justifyContent: isOwn ? "flex-end" : "flex-start" }}
          >
            {!isOwn && <Skeleton variant="circular" width={32} height={32} />}
            <Skeleton
              variant="rounded"
              width={isOwn ? "38%" : "46%"}
              height={54}
              sx={{
                borderRadius: 4,
                backgroundColor: isOwn
                  ? alpha(theme.palette.primary.main, 0.22)
                  : "rgba(255,255,255,0.07)",
              }}
            />
          </Stack>
        );
      })}
    </Box>
  );
};

/**
 * Simple centered loader for panels/lists.
 */
export const PanelLoader = ({ label = "Loading…" }: { label?: string }) => (
  <Stack spacing={1.5} sx={{ alignItems: "center", justifyContent: "center", py: 6 }}>
    <Skeleton variant="circular" width={40} height={40} />
    <Typography variant="caption" color="text.disabled">
      {label}
    </Typography>
    <Box className="chatty-shimmer" sx={{ width: 180, height: 12, ...shimmer }} />
  </Stack>
);