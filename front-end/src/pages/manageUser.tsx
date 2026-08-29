/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Paper,
  TextField,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ChattyTable, { Column } from "../components/table";
import { getFriends, inviteUserApi } from "../services/auth";
import { RootState } from "../redux/store";
import { formatDate } from "../utils/timeFormat";
import { FriendshipStatus } from "../constants/common";
import { showToast } from "../utils/toast";
import { COMMON_ERROR_MESSAGE, FAILED, SUCCESS } from "../constants/common";

export interface User {
  id?: string | number;
  receiver_email?: string;
  receiverEmail?: string;
  email?: string;
  invite_status?: string;
  is_blocked?: boolean;
  created_at?: string;
  updated_at?: string;
  update_status?: string;
  name?: string;
  status?: string;
  is_account_verified?: boolean;
  friendship_created_at?: string;
}

const getStatusChip = (status: string, theme: any) => {
  const value = (status || "PENDING").toUpperCase();
  switch (value) {
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
          label={value || "Pending"}
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

const getUserStatusChip = (status: string, theme: any) => {
  const value = (status || "ACTIVE").toUpperCase();
  const isActive = value === "ACTIVE" || value === "VERIFIED";
  return (
    <Chip
      size="small"
      label={isActive ? "Active" : "Inactive"}
      icon={isActive ? <CheckCircleOutlinedIcon /> : <CancelOutlinedIcon />}
      sx={{
        fontWeight: 700,
        backgroundColor: isActive
          ? alpha(theme.palette.success.main, 0.15)
          : alpha(theme.palette.warning.main, 0.15),
        color: isActive ? theme.palette.success.main : theme.palette.warning.main,
        border: `1px solid ${
          isActive ? alpha(theme.palette.success.main, 0.3) : alpha(theme.palette.warning.main, 0.3)
        }`,
      }}
    />
  );
};

export default function ManageUser() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { loginUser } = useSelector((state: RootState) => state.auth);
  const [friends, setFriends] = useState<User[]>([]);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("Hi! I would like to connect with you on Chatty.");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadFriends = async () => {
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
    loadFriends();
  }, []);

  const userName = useMemo(() => {
    return loginUser?.name || loginUser?.userName || "User";
  }, [loginUser]);

  const handleInvite = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Please enter an email address.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response = await inviteUserApi({
        email: trimmedEmail,
        message: message.trim() || "Hi! I would like to connect with you on Chatty.",
      });

      if (response?.success) {
        showToast(SUCCESS, "Invitation sent successfully!");
        setEmail("");
        setMessage("Hi! I would like to connect with you on Chatty.");
        navigate("/manageUser");
        await loadFriends();
      } else {
        showToast(FAILED, response?.message || COMMON_ERROR_MESSAGE);
      }
    } catch (err) {
      console.error("Failed to invite user:", err);
      showToast(FAILED, COMMON_ERROR_MESSAGE);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: Column<User>[] = [
    {
      id: "receiver_email",
      label: "User",
      format: (value, row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {row?.name || row?.email || value || "Unknown user"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {value || row?.receiverEmail || row?.email || "No email"}
          </Typography>
        </Box>
      ),
    },
    {
      id: "status",
      label: "Active Status",
      align: "center",
      format: (_, row) =>
        getUserStatusChip(String(row?.status || "ACTIVE"), theme),
    },
    {
      id: "invite_status",
      label: "Invitation Status",
      align: "center",
      format: (value) => getStatusChip(value || "PENDING", theme),
    },
    {
      id: "is_blocked",
      label: "Block Status",
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
            color: value ? theme.palette.error.main : theme.palette.success.main,
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
      id: "friendship_created_at",
      label: "Friend Since",
      format: (value) => (value ? formatDate(value) : "N/A"),
    },
    {
      id: "created_at",
      label: "Registered At",
      format: (value) => (value ? formatDate(value) : "N/A"),
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `radial-gradient(circle at 50% 0%, ${alpha(theme.palette.primary.main, 0.12)} 0%, ${theme.palette.background.default} 70%)`,
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <Box
            sx={{
              p: 1.25,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              display: "flex",
            }}
          >
            <PersonAddAltOutlinedIcon />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: "-0.5px" }}>
              Manage user
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Review your profile, invite teammates, and track invitation status.
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "minmax(250px, 320px) 1fr" },
            gap: 3,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: alpha(theme.palette.background.paper, 0.82),
              boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.08)}`,
              height: "100%",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <Avatar
                src={loginUser?.img || loginUser?.profileImage || ""}
                sx={{
                  width: 72,
                  height: 72,
                  fontSize: "1.8rem",
                  backgroundColor: theme.palette.primary.main,
                }}
              >
                {userName?.slice(0, 1).toUpperCase() || "U"}
              </Avatar>

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {userName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {loginUser?.email || "No email available"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center" }}>
                {getUserStatusChip(String(loginUser?.status || "ACTIVE"), theme)}
                <Chip
                  size="small"
                  label={loginUser?.is_account_verified ? "Verified" : "Unverified"}
                  sx={{
                    backgroundColor: loginUser?.is_account_verified
                      ? alpha(theme.palette.success.main, 0.15)
                      : alpha(theme.palette.warning.main, 0.15),
                    color: loginUser?.is_account_verified ? theme.palette.success.main : theme.palette.warning.main,
                    fontWeight: 700,
                  }}
                />
              </Box>
            </Box>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: alpha(theme.palette.background.paper, 0.82),
              boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.08)}`,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
              Invite a user
            </Typography>

            <Box component="form" onSubmit={handleInvite} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                fullWidth
                label="Email address"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
              />

              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Invitation message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />

              {error && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <PersonAddAltOutlinedIcon />}
                sx={{ alignSelf: "flex-start", px: 3, py: 1.2, borderRadius: 2 }}
              >
                {isSubmitting ? "Sending..." : "Send invite"}
              </Button>
            </Box>
          </Paper>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            mt: 3,
            borderRadius: 4,
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: alpha(theme.palette.background.paper, 0.8),
            boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.08)}`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Invitations
            </Typography>
            <Chip label={`${friends.length}`} size="small" color="primary" />
          </Box>
          <Divider sx={{ mb: 2 }} />
          <ChattyTable rows={friends} columns={columns} />
        </Paper>
      </Container>
    </Box>
  );
}
