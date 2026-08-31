import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Button,
  TextField,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { RootState } from "../../redux/store";
import {
  SET_EDIT_PROFILE_MODAL_OPEN,
  UPDATE_PROFILE_USER_DATA,
} from "../../redux/features/settings/settingsSlice";
import { updateUserInfoAPI } from "../../services/auth";
import { setUser } from "../../redux/features/auth/authSlice";
import { PURPLE_PRIMARY } from "../../theme";
import { showToast } from "../../utils/toast";
import { SUCCESS, FAILED } from "../../constants/common";

export const EditProfileModal: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { isEditProfileModalOpen, profileUserData } = useSelector(
    (state: RootState) => state.settings
  );
  const { loginUser } = useSelector((state: RootState) => state.auth);

  const [name, setName] = useState(loginUser?.name || profileUserData.name);
  const [username, setUsername] = useState(profileUserData.username);
  const [bio, setBio] = useState(loginUser?.bio || profileUserData.bio);
  const [phone, setPhone] = useState(profileUserData.phone);
  const [about, setAbout] = useState(profileUserData.about);
  const [country, setCountry] = useState(profileUserData.country);
  const [role, setRole] = useState(profileUserData.role);
  const [dob, setDob] = useState(profileUserData.dob);
  const [website, setWebsite] = useState(profileUserData.website);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setName(loginUser?.name || profileUserData.name);
    setUsername(profileUserData.username);
    setBio(loginUser?.bio || profileUserData.bio);
    setPhone(profileUserData.phone);
    setAbout(profileUserData.about);
    setCountry(profileUserData.country);
    setRole(profileUserData.role);
    setDob(profileUserData.dob);
    setWebsite(profileUserData.website);
  }, [profileUserData, loginUser, isEditProfileModalOpen]);

  const handleClose = () => {
    dispatch(SET_EDIT_PROFILE_MODAL_OPEN(false));
  };

  const handleSave = async () => {
    if (!name.trim()) {
      showToast(FAILED, "Name cannot be empty");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await updateUserInfoAPI({
        name: name.trim(),
        username: username.trim(),
        bio: bio.trim(),
        phone: phone.trim(),
        about: about.trim(),
        country: country.trim(),
        website: website.trim(),
        date_of_birth: dob,
      });
      if (!res?.success || !res.data) {
        throw new Error(res?.message || "Unable to save profile");
      }
      dispatch(setUser(res.data));

      dispatch(
        UPDATE_PROFILE_USER_DATA({
          name: res.data.name,
          username: res.data.username,
          bio: res.data.bio,
          phone: res.data.phone,
          about: res.data.about,
          country: res.data.country,
          role,
          dob,
          website,
        })
      );

      showToast(SUCCESS, "Profile updated successfully!");
      handleClose();
    } catch (err) {
      console.error("Profile update error:", err);
      showToast(FAILED, err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isEditProfileModalOpen}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: "16px",
            p: 0,
            overflow: "hidden",
            backgroundColor: theme.palette.mode === "dark" ? theme.palette.background.paper : "#FFFFFF",
            boxShadow: "0 10px 40px rgba(0,0,0,0.18)",
          },
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          px: 2.5,
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.05rem" }}>
          Edit Profile
        </Typography>

        <IconButton size="small" onClick={handleClose} sx={{ color: theme.palette.text.secondary }}>
          <CloseRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ p: 2.5, overflowY: "auto", maxHeight: "75vh" }}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            size="small"
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            fullWidth
            size="small"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <TextField
            fullWidth
            size="small"
            label="Role / Title"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />

          <TextField
            fullWidth
            size="small"
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <TextField
            fullWidth
            size="small"
            label="Country / Location"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />

          <TextField
            fullWidth
            size="small"
            label="About"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />

          <TextField
            fullWidth
            size="small"
            multiline
            rows={2}
            label="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />

          <TextField
            fullWidth
            size="small"
            label="Website Address"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </Stack>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ px: 2.5, pb: 2.5, pt: 1, gap: 1.5 }}>
        <Button
          variant="outlined"
          onClick={handleClose}
          sx={{
            flex: 1,
            py: 0.85,
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
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isSubmitting}
          sx={{
            flex: 1,
            py: 0.85,
            borderRadius: "8px",
            backgroundColor: PURPLE_PRIMARY,
            color: "#FFFFFF",
            fontSize: "0.8125rem",
            fontWeight: 600,
            "&:hover": { backgroundColor: "#6D28D9" },
          }}
        >
          {isSubmitting ? <CircularProgress size={18} color="inherit" /> : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfileModal;
