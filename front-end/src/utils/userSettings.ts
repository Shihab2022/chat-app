/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppDispatch } from "../redux/store";
import {
  SET_THEME,
  SET_FONT_SIZE,
  SET_COMPACT_LIST,
  APPLY_WALLPAPER,
  SET_DISAPPEARING_MESSAGES,
  UPDATE_PROFILE_USER_DATA,
  ThemeMode,
  FontSizeOption,
  DisappearingOption,
} from "../redux/features/settings/settingsSlice";
import { updateUserInfoAPI } from "../services/auth";
import { TUser } from "../types";

const isThemeMode = (value: unknown): value is ThemeMode =>
  value === "light" || value === "dark";

const isFontSize = (value: unknown): value is FontSizeOption =>
  value === "small" || value === "default" || value === "large" || value === "extra-large";

const isDisappearing = (value: unknown): value is DisappearingOption =>
  value === "off" || value === "24h" || value === "7d" || value === "30d";

export const hydrateUserSettings = (dispatch: AppDispatch, user: TUser) => {
  if (!user) return;

  if (isThemeMode(user.theme)) {
    dispatch(SET_THEME(user.theme));
  }

  if (isFontSize(user.font_size)) {
    dispatch(SET_FONT_SIZE(user.font_size));
  }

  if (typeof user.compact_list === "boolean") {
    dispatch(SET_COMPACT_LIST(user.compact_list));
  }

  if (user.wallpaper_id) {
    dispatch(APPLY_WALLPAPER(String(user.wallpaper_id)));
  }

  if (isDisappearing(user.disappearing_messages)) {
    dispatch(SET_DISAPPEARING_MESSAGES(user.disappearing_messages));
  }

  dispatch(
    UPDATE_PROFILE_USER_DATA({
      name: user.name || "",
      username: user.username ? `@${String(user.username).replace(/^@/, "")}` : "",
      email: user.email || "",
      phone: user.phone || "",
      about: user.about || "",
      bio: user.bio || "",
      country: user.country || "",
      role: user.role || "",
      lastSeen: "Online",
      avatar: user.img || "",
      dob: user.date_of_birth || "",
      website: user.website || "",
    })
  );
};

export const persistUserSettings = async (payload: Record<string, any>) => {
  try {
    await updateUserInfoAPI(payload);
  } catch (error) {
    console.error("Failed to persist user settings:", error);
  }
};
