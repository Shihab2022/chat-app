import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { alpha, useTheme } from "@mui/material/styles";
import { RootState } from "../redux/store";
import { StyledBadge } from "./StyledBadge";
import TypingIndicator from "./messages/TypingIndicator";
import { TUser } from "../types";

interface LeftSiteBarCardProps {
  user: TUser & {
    isTyping?: boolean;
    lastMessage?: {
      text?: string;
    };
  };
  onClick?: (user: TUser) => void;
}

export default function LeftSiteBarCard({
  onClick,
  user,
}: LeftSiteBarCardProps) {
  const theme = useTheme();
  const { activeUsers = [] } = useSelector((state: RootState) => state?.auth);
  const { receiverId } = useSelector((state: RootState) => state?.message);

  const { name, img, id, email, isTyping = false, lastMessage = {} } = user;
  const isSelected = receiverId === id;
  const isOnline = !user.isGroup && activeUsers?.includes(id?.toString());

  return (
    <Card
      elevation={0}
      onClick={() => onClick?.(user)}
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        p: 1.5,
        borderRadius: 2,
        cursor: "pointer",
        backgroundColor: isSelected
          ? alpha(theme.palette.primary.main, 0.1)
          : "transparent",
        transition: "background-color 0.2s ease, transform 0.1s ease",
        "&:hover": {
          backgroundColor: isSelected
            ? alpha(theme.palette.primary.main, 0.15)
            : alpha(theme.palette.action.hover, 0.06),
        },
      }}
    >
      {/* Avatar with Status Badge */}
      <Box sx={{ mr: 2, display: "flex", alignItems: "center" }}>
        {isOnline ? (
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
          >
            <Avatar alt={name} src={img} sx={{ width: 44, height: 44 }}>
              {name?.slice(0, 2).toUpperCase()}
            </Avatar>
          </StyledBadge>
        ) : (
          <Avatar alt={name} src={img} sx={{ width: 44, height: 44 }}>
            {name?.slice(0, 2).toUpperCase()}
          </Avatar>
        )}
      </Box>

      {/* User Details */}
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Stack
          direction="row"
          sx={{justifyContent: "space-between", alignItems: "baseline"}}
        >
          <Typography
            variant="subtitle2"
            noWrap
            sx={{
              fontWeight: isSelected ? 700 : 600,
              color: isSelected
                ? theme.palette.primary.main
                : theme.palette.text.primary,
            }}
          >
            {name}
          </Typography>
        </Stack>

        <Typography
          variant="caption"
          noWrap
          sx={{
            color: theme.palette.text.secondary,
            fontSize: "0.75rem",
            mb: 0.25,
          }}
        >
          {user.isGroup ? "Group conversation" : email}
        </Typography>

        {/* Message Preview or Typing Indicator */}
        {isTyping ? (
          <TypingIndicator />
        ) : (
          <Typography
            variant="body2"
            noWrap
            sx={{
              fontSize: "0.825rem",
              color: lastMessage?.text
                ? theme.palette.text.secondary
                : theme.palette.text.disabled,
              fontStyle: lastMessage?.text ? "normal" : "italic",
            }}
          >
            {lastMessage?.text
              ? lastMessage.text.length > 25
                ? `${lastMessage.text.slice(0, 25)}...`
                : lastMessage.text
              : "No messages yet"}
          </Typography>
        )}
      </Box>
    </Card>
  );
}
