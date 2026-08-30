import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Avatar,
  Badge,
  Divider,
  Stack,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LocationCityOutlinedIcon from "@mui/icons-material/LocationCityOutlined";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import QrCodeRoundedIcon from "@mui/icons-material/QrCodeRounded";
import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded";

import { RootState } from "../../redux/store";
import {
  SET_QR_CODE_MODAL_OPEN,
  SET_EDIT_PROFILE_MODAL_OPEN,
  UPDATE_PROFILE_USER_DATA,
} from "../../redux/features/settings/settingsSlice";
import { setUser } from "../../redux/features/auth/authSlice";
import { uploadMessageAttachmentAPI } from "../../services/message";
import { updateUserInfoAPI } from "../../services/auth";
import { PURPLE_PRIMARY, STATUS_ONLINE } from "../../theme";
import { showToast } from "../../utils/toast";
import { SUCCESS, FAILED } from "../../constants/common";

export const ProfileSidebar: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = React.useState(false);

  const { profileUserData } = useSelector((state: RootState) => state.settings);
  const { loginUser } = useSelector((state: RootState) => state.auth);

  const displayName = loginUser?.name || profileUserData.name;
  const userAvatar = loginUser?.img || profileUserData.avatar;
  const username = profileUserData.username;
  const email = loginUser?.email || profileUserData.email;
  const phone = profileUserData.phone;
  const about = profileUserData.about;
  const bio = loginUser?.bio || profileUserData.bio;
  const country = profileUserData.country;
  const role = profileUserData.role;
  const lastSeen = profileUserData.lastSeen;

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingAvatar(true);
      const uploadRes = await uploadMessageAttachmentAPI(file);
      if (uploadRes?.success && uploadRes.data?.url) {
        const imageUrl = uploadRes.data.url;
        const updateRes = await updateUserInfoAPI({ img: imageUrl });
        if (updateRes?.success && updateRes.data) {
          dispatch(setUser(updateRes.data));
        } else {
          dispatch(setUser({ ...loginUser, img: imageUrl }));
        }
        dispatch(UPDATE_PROFILE_USER_DATA({ avatar: imageUrl }));
        showToast(SUCCESS, "Avatar updated successfully!");
      } else {
        showToast(FAILED, uploadRes?.message || "Failed to upload avatar");
      }
    } catch (err) {
      console.error("Avatar upload failed:", err);
      showToast(FAILED, "Failed to upload avatar");
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const infoRows = [
    { label: "Name", value: displayName, icon: PersonOutlineRoundedIcon },
    { label: "Username", value: username, icon: AlternateEmailRoundedIcon },
    { label: "Email Address", value: email, icon: MailOutlineRoundedIcon },
    { label: "Phone", value: phone, icon: PhoneOutlinedIcon },
    { label: "About", value: about, icon: InfoOutlinedIcon },
    { label: "Bio", value: bio, icon: EditOutlinedIcon },
    { label: "Country", value: country, icon: LocationCityOutlinedIcon },
    { label: "Last Seen", value: lastSeen, icon: AccessTimeRoundedIcon },
  ];

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
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarFileChange}
        accept="image/*"
        style={{ display: "none" }}
      />

      {/* ── Top Header ── */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.15rem", color: theme.palette.text.primary }}>
          Profile
        </Typography>

        <IconButton size="small" sx={{ color: theme.palette.text.secondary }}>
          <MoreVertRoundedIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

      {/* ── Scrollable Profile Content ── */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 2.5, pb: 3 }}>
        {/* Top Profile Card */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2.5, pt: 1 }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: STATUS_ONLINE,
                boxShadow: "0 0 0 3px #FFFFFF",
                width: 14,
                height: 14,
                borderRadius: "50%",
              },
            }}
          >
            <Avatar
              src={userAvatar}
              alt={displayName}
              sx={{
                width: 90,
                height: 90,
                fontSize: "2rem",
                fontWeight: 700,
                backgroundColor: alpha(PURPLE_PRIMARY, 0.15),
                color: PURPLE_PRIMARY,
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              }}
            >
              {displayName?.[0]?.toUpperCase()}
            </Avatar>
          </Badge>

          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.1rem", mt: 1.5, textAlign: "center" }}>
            {displayName}
          </Typography>

          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: "0.825rem" }}>
            {role}
          </Typography>
        </Box>

        {/* 3 Action Buttons matching PDF Page 7 */}
        <Stack direction="row" spacing={1} sx={{ mb: 3, justifyContent: "center" }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => dispatch(SET_EDIT_PROFILE_MODAL_OPEN(true))}
            startIcon={<EditOutlinedIcon sx={{ fontSize: 15 }} />}
            sx={{
              backgroundColor: PURPLE_PRIMARY,
              color: "#FFFFFF",
              fontSize: "0.75rem",
              fontWeight: 600,
              py: 0.75,
              px: 1.5,
              borderRadius: "8px",
              "&:hover": { backgroundColor: "#6D28D9" },
            }}
          >
            Edit Profile
          </Button>

          <Button
            variant="outlined"
            size="small"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingAvatar}
            startIcon={isUploadingAvatar ? <CircularProgress size={14} color="inherit" /> : <PhotoCameraRoundedIcon sx={{ fontSize: 15 }} />}
            sx={{
              borderColor: PURPLE_PRIMARY,
              color: PURPLE_PRIMARY,
              fontSize: "0.75rem",
              fontWeight: 600,
              py: 0.75,
              px: 1.25,
              borderRadius: "8px",
              "&:hover": {
                borderColor: "#6D28D9",
                backgroundColor: alpha(PURPLE_PRIMARY, 0.05),
              },
            }}
          >
            {isUploadingAvatar ? "Uploading..." : "Change Avatar"}
          </Button>

          <Tooltip title="View or Share QR Code" arrow>
            <Button
              variant="outlined"
              size="small"
              onClick={() => dispatch(SET_QR_CODE_MODAL_OPEN({ open: true, tab: "my-code" }))}
              startIcon={<QrCodeRoundedIcon sx={{ fontSize: 15 }} />}
              sx={{
                borderColor: PURPLE_PRIMARY,
                color: PURPLE_PRIMARY,
                fontSize: "0.75rem",
                fontWeight: 600,
                py: 0.75,
                px: 1.25,
                borderRadius: "8px",
                "&:hover": {
                  borderColor: "#6D28D9",
                  backgroundColor: alpha(PURPLE_PRIMARY, 0.05),
                },
              }}
            >
              QR Code
            </Button>
          </Tooltip>
        </Stack>

        {/* Section: Profile Info */}
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            fontSize: "0.85rem",
            color: theme.palette.text.primary,
            mb: 1.5,
          }}
        >
          Profile Info
        </Typography>

        <Box
          sx={{
            backgroundColor: theme.palette.mode === "dark" ? alpha("#FFFFFF", 0.02) : "#FFFFFF",
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: "12px",
            p: 1.5,
          }}
        >
          {infoRows.map((row, idx) => {
            const Icon = row.icon;
            return (
              <React.Fragment key={row.label}>
                <Box
                  sx={{
                    py: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: "block" }}>
                      {row.label}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.8125rem",
                        color: theme.palette.text.primary,
                        wordBreak: "break-word",
                      }}
                    >
                      {row.value || "—"}
                    </Typography>
                  </Box>

                  <Icon sx={{ color: theme.palette.text.secondary, fontSize: 18, ml: 1 }} />
                </Box>
                {idx < infoRows.length - 1 && <Divider sx={{ my: 0.5, borderColor: theme.palette.divider }} />}
              </React.Fragment>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileSidebar;
