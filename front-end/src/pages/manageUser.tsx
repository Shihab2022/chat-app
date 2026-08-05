/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Chip, Container, Paper, Typography, alpha } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ChattyTable, { Column } from "../components/table";
import { getFriends } from "../services/auth";
import { useEffect, useState } from "react";
import { formatDate } from "../utils/timeFormat";
import { FriendshipStatus } from "../constants/common";

export interface User {
  receiver_email: string;
  invite_status: string;
  is_blocked: boolean;
  created_at: string;
  update_status: string;
}

const getStatusChip = (status: string, theme: any) => {
  switch (status) {
    case FriendshipStatus.ACCEPTED:
      return (
        <Chip
          label="Accepted"
          size="small"
          sx={{
            fontWeight: 600,
            backgroundColor: alpha(theme.palette.success.main, 0.15),
            color: theme.palette.success.main,
            border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
          }}
        />
      );
    case FriendshipStatus.REJECTED:
      return (
        <Chip
          label="Rejected"
          size="small"
          sx={{
            fontWeight: 600,
            backgroundColor: alpha(theme.palette.error.main, 0.15),
            color: theme.palette.error.main,
            border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
          }}
        />
      );
    default:
      return (
        <Chip
          label={status || "Pending"}
          size="small"
          sx={{
            fontWeight: 600,
            backgroundColor: alpha(theme.palette.primary.main, 0.15),
            color: theme.palette.primary.main,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
          }}
        />
      );
  }
};

export default function ManageUser() {
  const theme = useTheme();
  const [friends, setFriends] = useState<User[]>([]);

  const getFriendsData = async () => {
    try {
      const res = await getFriends({});
      if (res?.success) {
        setFriends(res?.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch user connections:", error);
    }
  };

  useEffect(() => {
    getFriendsData();
  }, []);

  const columns: Column<User>[] = [
    { id: "receiver_email", label: "Receiver Email" },
    {
      id: "invite_status",
      label: "Invite Status",
      align: "center",
      format: (value) => getStatusChip(value, theme),
    },
    {
      id: "is_blocked",
      label: "Status",
      align: "center",
      format: (value) => (
        <Chip
          label={value ? "Blocked" : "Active"}
          size="small"
          sx={{
            fontWeight: 600,
            backgroundColor: value
              ? alpha(theme.palette.error.main, 0.15)
              : alpha(theme.palette.success.main, 0.15),
            color: value
              ? theme.palette.error.main
              : theme.palette.success.main,
            border: `1px solid ${
              value
                ? alpha(theme.palette.error.main, 0.3)
                : alpha(theme.palette.success.main, 0.3)
            }`,
          }}
        />
      ),
    },
    {
      id: "created_at",
      label: "Created At",
      format: (value) => (value ? formatDate(value) : "N/A"),
    },
    {
      id: "update_status",
      label: "Updated At",
      format: (value) => (value ? formatDate(value) : "N/A"),
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `radial-gradient(circle at 50% 0%, ${alpha(
          theme.palette.primary.main,
          0.12,
        )} 0%, ${theme.palette.background.default} 70%)`,
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        {/* Page Header */}
        <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              display: "flex",
            }}
          >
            <PeopleAltIcon />
          </Box>
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, letterSpacing: "-0.5px" }}
            >
              Manage Users
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View and manage user connections and invitation statuses.
            </Typography>
          </Box>
        </Box>

        {/* Main Content Card */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 4,
            border: `1px solid ${theme.palette.divider}`,
            backdropFilter: "blur(10px)",
            backgroundColor: alpha(theme.palette.background.paper, 0.8),
            boxShadow: `0 8px 32px 0 ${alpha(
              theme.palette.common.black,
              0.08,
            )}`,
          }}
        >
          <ChattyTable rows={friends} columns={columns} />
        </Paper>
      </Container>
    </Box>
  );
}
