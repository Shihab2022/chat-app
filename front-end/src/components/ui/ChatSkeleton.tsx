import { Box, Paper, Skeleton } from "@mui/material";

export interface Conversation {
  id: string;
  name: string;
  avatar: string | unknown;
  isGroup?: boolean;
  online?: boolean;
  lastMessage?: string;
  time?: string;
  unread?: number;
  muted?: boolean;
  isActive?: boolean;
  key?: string;
  raw: any;
}

export function ChatSkeleton({ count = 8 }: { count?: number }) {
  return (
    <Box sx={{ p: 2, pb: 1 }}>
      {Array.from({ length: count }).map((_, i) => (
        <Paper
          key={`skeleton-${i}`}
          variant="elevation"
          sx={{
            p: 1.5,
            mb: 1.5,
            borderRadius: 2.5,
            backgroundColor: "background.paper",
          }}
        >
          <Box sx={{ display: "flex", gap: 1.25, alignItems: "flex-start" }}>
            <Skeleton variant="circular" width={48} height={48} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Skeleton variant="text" height={18} width="60%" sx={{ mb: 1 }} />
              <Skeleton variant="rectangular" height={14} width="90%" sx={{ mb: 0.75, borderRadius: 1 }} />
              <Skeleton variant="rectangular" height={14} width="60%" sx={{ borderRadius: 1 }} />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.5 }}>
              <Skeleton variant="text" height={14} width={40} />
              <Skeleton variant="circular" width={22} height={22} sx={{ mt: 0.5 }} />
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );
}

export default ChatSkeleton;
