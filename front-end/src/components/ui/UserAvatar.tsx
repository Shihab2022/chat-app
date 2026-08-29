/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, Badge } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import GroupIcon from "@mui/icons-material/Group";

export const resolveUserImg = (img?: string) => {
  if (!img) return undefined;
  if (img.startsWith("data:") || img.startsWith("http") || img.startsWith("https")) return img;
  return `data:image/jpeg;base64,${img}`;
};

interface UserAvatarProps {
  name?: string;
  img?: string;
  size?: number;
  isOnline?: boolean;
  isGroup?: boolean;
  onlineColor?: string;
  className?: string;
}

/**
 * Consistent avatar: image → initials, optional online dot and group icon.
 */
const UserAvatar = ({
  name,
  img,
  size = 44,
  isOnline = false,
  isGroup = false,
  onlineColor = "#2DD4A7",
  className,
}: UserAvatarProps) => {
  const theme = useTheme();
  const initials = (name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const avatar = (
    <Avatar
      src={resolveUserImg(img)}
      alt={name || "avatar"}
      className={className}
      sx={{
        width: size,
        height: size,
        fontSize: Math.max(12, Math.round(size * 0.34)),
        fontWeight: 600,
        backgroundColor: isGroup
          ? alpha(theme.palette.secondary.main, 0.18)
          : alpha(theme.palette.primary.main, 0.24),
        color: isGroup ? theme.palette.secondary.light : theme.palette.text.primary,
        border: `1px solid ${alpha(theme.palette.common.white, 0.06)}`,
      }}
    >
      {img ? undefined : isGroup ? (
        <GroupIcon sx={{ fontSize: size * 0.5, opacity: 0.9 }} />
      ) : (
        initials
      )}
    </Avatar>
  );

  if (!isOnline) return avatar;

  return (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      variant="dot"
      sx={{
        "& .MuiBadge-badge": {
          backgroundColor: onlineColor,
          color: onlineColor,
          boxShadow: `0 0 0 2px ${theme.palette.background.default}`,
          width: Math.max(10, Math.round(size * 0.25)),
          height: Math.max(10, Math.round(size * 0.25)),
          borderRadius: "50%",
          bottom: 1,
          right: 1,
        },
      }}
    >
      {avatar}
    </Badge>
  );
};

export default UserAvatar;