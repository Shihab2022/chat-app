/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  DEFAULT_CHAT_WALLPAPER_STYLE,
  DEFAULT_DARK_WALLPAPER_STYLE,
  ALL_WALLPAPERS,
} from "../../../constants/wallpapers";

export type ThemeMode = "light" | "dark";
export type FontSizeOption = "small" | "default" | "large" | "extra-large";
export type DisappearingOption = "off" | "24h" | "7d" | "30d";
export type NavTab = "chats" | "contacts" | "groups" | "status" | "calls" | "saved" | "settings" | "profile";
export type SettingsSection =
  | "main"
  | "appearance"
  | "account"
  | "privacy"
  | "security"
  | "notifications"
  | "chats"
  | "language"
  | "storage"
  | "devices";

export interface SettingsState {
  theme: ThemeMode;
  fontSize: FontSizeOption;
  compactList: boolean;
  wallpaperId: string;
  wallpaperCategory: "all" | "solid" | "light" | "patterns";
  wallpaperStyle: Record<string, any>;
  previewWallpaperId: string | null;
  disappearingMessages: DisappearingOption;
  isWallpaperPanelOpen: boolean;
  activeNavTab: NavTab;
  settingsSection: SettingsSection;
  isQRCodeModalOpen: boolean;
  qrCodeInitialTab: "my-code" | "scan-code";
  isNewGroupModalOpen: boolean;
  isNewChatModalOpen: boolean;
  isContactDetailModalOpen: boolean;
  selectedContactForDetail: any;
  isEditProfileModalOpen: boolean;
  isArchivedChatsOpen: boolean;
  isDisappearingModalOpen: boolean;
  isInviteFriendModalOpen: boolean;
  profileUserData: {
    name: string;
    username: string;
    email: string;
    phone: string;
    about: string;
    bio: string;
    country: string;
    role: string;
    lastSeen: string;
    avatar: string;
    dob: string;
    website: string;
  };
}

const loadStored = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

const initialTheme = loadStored<ThemeMode>("chat_theme", "light");
const initialFontSize = loadStored<FontSizeOption>("chat_font_size", "default");
const initialCompactList = loadStored<boolean>("chat_compact_list", false);
const initialWallpaperId = loadStored<string>("chat_wallpaper_id", "default");
const initialDisappearing = loadStored<DisappearingOption>("chat_disappearing", "7d");

const getWallpaperStyleById = (id: string, theme: ThemeMode) => {
  if (!id || id === "default") {
    return theme === "dark" ? DEFAULT_DARK_WALLPAPER_STYLE : DEFAULT_CHAT_WALLPAPER_STYLE;
  }
  const found = ALL_WALLPAPERS.find((w) => w.id === id);
  return found?.cssStyle || (theme === "dark" ? DEFAULT_DARK_WALLPAPER_STYLE : DEFAULT_CHAT_WALLPAPER_STYLE);
};

const initialState: SettingsState = {
  theme: initialTheme,
  fontSize: initialFontSize,
  compactList: initialCompactList,
  wallpaperId: initialWallpaperId,
  wallpaperCategory: "all",
  wallpaperStyle: getWallpaperStyleById(initialWallpaperId, initialTheme),
  previewWallpaperId: null,
  disappearingMessages: initialDisappearing,
  isWallpaperPanelOpen: false,
  activeNavTab: "chats",
  settingsSection: "main",
  isQRCodeModalOpen: false,
  qrCodeInitialTab: "my-code",
  isNewGroupModalOpen: false,
  isNewChatModalOpen: false,
  isContactDetailModalOpen: false,
  selectedContactForDetail: null,
  isEditProfileModalOpen: false,
  isArchivedChatsOpen: false,
  isDisappearingModalOpen: false,
  isInviteFriendModalOpen: false,
  profileUserData: {
    name: "",
    username: "",
    email: "",
    phone: "",
    about: "",
    bio: "",
    country: "",
    role: "",
    lastSeen: "",
    avatar: "",
    dob: "",
    website: "",
  },
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    SET_THEME: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload;
      localStorage.setItem("chat_theme", JSON.stringify(action.payload));
      if (!state.wallpaperId || state.wallpaperId === "default") {
        state.wallpaperStyle =
          action.payload === "dark" ? DEFAULT_DARK_WALLPAPER_STYLE : DEFAULT_CHAT_WALLPAPER_STYLE;
      }
    },
    SET_FONT_SIZE: (state, action: PayloadAction<FontSizeOption>) => {
      state.fontSize = action.payload;
      localStorage.setItem("chat_font_size", JSON.stringify(action.payload));
    },
    SET_COMPACT_LIST: (state, action: PayloadAction<boolean>) => {
      state.compactList = action.payload;
      localStorage.setItem("chat_compact_list", JSON.stringify(action.payload));
    },
    SET_WALLPAPER_PREVIEW: (state, action: PayloadAction<string | null>) => {
      state.previewWallpaperId = action.payload;
    },
    APPLY_WALLPAPER: (state, action: PayloadAction<string>) => {
      state.wallpaperId = action.payload;
      state.previewWallpaperId = null;
      state.wallpaperStyle = getWallpaperStyleById(action.payload, state.theme);
      localStorage.setItem("chat_wallpaper_id", JSON.stringify(action.payload));
    },
    RESET_WALLPAPER: (state) => {
      state.wallpaperId = "default";
      state.previewWallpaperId = null;
      state.wallpaperStyle =
        state.theme === "dark" ? DEFAULT_DARK_WALLPAPER_STYLE : DEFAULT_CHAT_WALLPAPER_STYLE;
      localStorage.setItem("chat_wallpaper_id", JSON.stringify("default"));
    },
    SET_WALLPAPER_CATEGORY: (state, action: PayloadAction<"all" | "solid" | "light" | "patterns">) => {
      state.wallpaperCategory = action.payload;
    },
    SET_DISAPPEARING_MESSAGES: (state, action: PayloadAction<DisappearingOption>) => {
      state.disappearingMessages = action.payload;
      localStorage.setItem("chat_disappearing", JSON.stringify(action.payload));
    },
    SET_WALLPAPER_PANEL_OPEN: (state, action: PayloadAction<boolean>) => {
      state.isWallpaperPanelOpen = action.payload;
    },
    SET_ACTIVE_NAV_TAB: (state, action: PayloadAction<NavTab>) => {
      state.activeNavTab = action.payload;
    },
    SET_SETTINGS_SECTION: (state, action: PayloadAction<SettingsSection>) => {
      state.settingsSection = action.payload;
    },
    SET_QR_CODE_MODAL_OPEN: (
      state,
      action: PayloadAction<{ open: boolean; tab?: "my-code" | "scan-code" }>
    ) => {
      state.isQRCodeModalOpen = action.payload.open;
      if (action.payload.tab) state.qrCodeInitialTab = action.payload.tab;
    },
    SET_NEW_GROUP_MODAL_OPEN: (state, action: PayloadAction<boolean>) => {
      state.isNewGroupModalOpen = action.payload;
    },
    SET_NEW_CHAT_MODAL_OPEN: (state, action: PayloadAction<boolean>) => {
      state.isNewChatModalOpen = action.payload;
    },
    SET_CONTACT_DETAIL_MODAL: (
      state,
      action: PayloadAction<{ open: boolean; contact?: any }>
    ) => {
      state.isContactDetailModalOpen = action.payload.open;
      if (action.payload.contact) {
        state.selectedContactForDetail = action.payload.contact;
      }
    },
    SET_EDIT_PROFILE_MODAL_OPEN: (state, action: PayloadAction<boolean>) => {
      state.isEditProfileModalOpen = action.payload;
    },
    SET_ARCHIVED_CHATS_OPEN: (state, action: PayloadAction<boolean>) => {
      state.isArchivedChatsOpen = action.payload;
    },
    SET_DISAPPEARING_MODAL_OPEN: (state, action: PayloadAction<boolean>) => {
      state.isDisappearingModalOpen = action.payload;
    },
    SET_INVITE_FRIEND_MODAL_OPEN: (state, action: PayloadAction<boolean>) => {
      state.isInviteFriendModalOpen = action.payload;
    },
    UPDATE_PROFILE_USER_DATA: (state, action: PayloadAction<Partial<SettingsState["profileUserData"]>>) => {
      state.profileUserData = {
        ...state.profileUserData,
        ...action.payload,
      };
    },
  },
});

export const {
  SET_THEME,
  SET_FONT_SIZE,
  SET_COMPACT_LIST,
  SET_WALLPAPER_PREVIEW,
  APPLY_WALLPAPER,
  RESET_WALLPAPER,
  SET_WALLPAPER_CATEGORY,
  SET_DISAPPEARING_MESSAGES,
  SET_WALLPAPER_PANEL_OPEN,
  SET_ACTIVE_NAV_TAB,
  SET_SETTINGS_SECTION,
  SET_QR_CODE_MODAL_OPEN,
  SET_NEW_GROUP_MODAL_OPEN,
  SET_NEW_CHAT_MODAL_OPEN,
  SET_CONTACT_DETAIL_MODAL,
  SET_EDIT_PROFILE_MODAL_OPEN,
  SET_ARCHIVED_CHATS_OPEN,
  SET_DISAPPEARING_MODAL_OPEN,
  SET_INVITE_FRIEND_MODAL_OPEN,
  UPDATE_PROFILE_USER_DATA,
} = settingsSlice.actions;

export default settingsSlice.reducer;
