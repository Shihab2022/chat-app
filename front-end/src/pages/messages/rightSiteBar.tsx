import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { alpha, useTheme } from "@mui/material/styles";

import { RootState } from "../../redux/store";
import { rightSideActionInfo, rightSiteIds } from "../../constants/common";
import { rightSideActionTypes, TUser } from "../../types";
import {
  SET_CONVERSATION,
  SET_RECEIVER_ID,
  SET_RIGHT_SIDEBAR_OPEN_STATUS,
} from "../../redux/features/chat/conversationSlice";
import { blockUserAPI } from "../../services/auth";
import { clearChatAPI } from "../../services/message";
import { SET_ALL_USERS } from "../../redux/features/auth/authSlice";
import { showToast } from "../../utils/toast";
import {
  COMMON_ERROR_MESSAGE,
  FAILED,
  SUCCESS,
} from "../../constants/common";

export const RightSidebar = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { receiverId } = useSelector((state: RootState) => state?.message);
  const { allUsers } = useSelector((state: RootState) => state?.auth);

  const selectedUserInfo = useMemo(() => {
    if (allUsers?.length > 0 && receiverId) {
      return allUsers.find((u: TUser) => u?.id === receiverId);
    }
    return null;
  }, [receiverId, allUsers]);

  const userImage = selectedUserInfo?.profileImage
    ? `data:image/jpeg;base64,${selectedUserInfo?.profileImage}`
    : "";

  const handleClick = async (info: rightSideActionTypes, userInfo?: TUser) => {
    if (!userInfo) return;

    switch (info.id) {
      case rightSiteIds.FAVORITE:
        console.log("favorite clicked", userInfo);
        break;
      case rightSiteIds.CLEAR_CHAT:
        {
          const res = await clearChatAPI({ friendId: userInfo.id });
          if (res?.success) {
            dispatch(SET_CONVERSATION({}));
            showToast(SUCCESS, "Chat cleared");
          } else {
            showToast(FAILED, res?.message || COMMON_ERROR_MESSAGE);
          }
        }
        break;
      case rightSiteIds.BLOCK_USER: {
        const res = await blockUserAPI({ friendId: userInfo?.id });
        if (res?.success) {
          dispatch(SET_CONVERSATION({}));
          dispatch(
            SET_ALL_USERS(
              allUsers.filter((user: TUser) => user.id !== userInfo.id),
            ),
          );
          dispatch(SET_RECEIVER_ID(""));
          dispatch(SET_RIGHT_SIDEBAR_OPEN_STATUS(false));
          showToast(SUCCESS, "User blocked");
        } else {
          showToast(FAILED, res?.message || COMMON_ERROR_MESSAGE);
        }
        break;
      }
      case rightSiteIds.DELETE_CHAT:
        console.log("delete chat clicked", userInfo);
        break;
      default:
        break;
    }
  };

  return (
    <Box sx={{ color: theme.palette.text.primary }}>
      {/* Header */}
      <Stack
        direction="row"
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          mt: 1,
          mb: 3,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Contact Info
        </Typography>
        <IconButton
          size="small"
          onClick={() => dispatch(SET_RIGHT_SIDEBAR_OPEN_STATUS(false))}
          sx={{ color: theme.palette.text.secondary }}
        >
          <CloseIcon />
        </IconButton>
      </Stack>

      {/* User Avatar */}
      <Stack sx={{ mb: 2, justifyContent: "center", alignItems: "center" }}>
        <Avatar
          src={selectedUserInfo?.img || userImage}
          sx={{
            width: 80,
            height: 80,
            fontSize: "1.75rem",
            fontWeight: 600,
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            boxShadow: `0 4px 14px ${alpha(theme.palette.common.black, 0.12)}`,
          }}
        >
          {!selectedUserInfo?.img &&
            !userImage &&
            selectedUserInfo?.name?.slice(0, 2).toUpperCase()}
        </Avatar>
      </Stack>

      {/* Name and Email */}
      <Typography
        variant="h6"
        sx={{
          textAlign: "center",
          fontWeight: 700,
          mb: 0.5,
        }}
      >
        {selectedUserInfo?.name || "User"}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: theme.palette.text.secondary,
          textAlign: "center",
          mb: 3,
        }}
      >
        {selectedUserInfo?.email || ""}
      </Typography>

      {/* About Section */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.secondary,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          About
        </Typography>
        <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
          {selectedUserInfo?.bio || "No bio available."}
        </Typography>
      </Box>

      <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />

      {/* Action Items */}
      <Stack spacing={0.5}>
        {(selectedUserInfo?.isGroup ? [] : rightSideActionInfo).map((action) => (
          <Stack
            key={action.id}
            direction="row"
            spacing={1.5}
            onClick={() => handleClick(action, selectedUserInfo)}
            sx={{
              cursor: "pointer",
              color: action.isRed
                ? theme.palette.error.main
                : theme.palette.text.primary,
              px: 2,
              py: 1.25,
              borderRadius: 2,
              alignItems: "center",
              transition: "background-color 0.2s ease",
              "&:hover": {
                backgroundColor: action.isRed
                  ? alpha(theme.palette.error.main, 0.08)
                  : alpha(theme.palette.action.hover, 0.08),
              },
            }}
          >
            <action.icon sx={{ fontSize: "1.3rem" }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {action.title}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};
