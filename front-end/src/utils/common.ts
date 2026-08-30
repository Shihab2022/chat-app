/* eslint-disable @typescript-eslint/no-explicit-any */
import { get } from "lodash";
import { Reaction, TMessage, TUser } from "../types";
import { formatDate } from "./timeFormat";

export const toStartCaseStr = (str: string) => {
  try {
    return str
      .replace(/_/g, " ")
      .replace(/([a-z])([A-Z])/g, (_str, $1, $2) => $1 + " " + $2)
      .replace(/(\s|^)(\w)/g, (_str, $1, $2) => $1 + $2.toUpperCase());
  } catch (error) {
    return str;
  }
};

export const randomTwoDigit = () =>
  (Math.floor(Math.random() * 9) + 1) * 10 +
  (Math.floor(Math.random() * 9) + 1);

export const formateEmojiDialogData = (
  reactions: Reaction[],
  allUsers: TUser[],
) => {
  // Group reactions by emoji
  const formattedReactions = reactions?.map((r) => {
    const u = allUsers.find((u: TUser) => u?.id === r?.userId);
    return {
      ...r,
      img: u?.img,
      name: u?.name,
    };
  });
  const grouped = formattedReactions.reduce<Record<string, Reaction[]>>(
    (acc, item) => {
      if (!acc[item.emoji]) {
        acc[item.emoji] = [];
      }
      acc[item.emoji].push(item);
      return acc;
    },
    {},
  );
  return { All: formattedReactions, ...grouped };
};

export const formateMessageAndUpdate = (
  newMessage: any,
  allMessage: Record<string, TMessage[]>,
) => {
  const formattedDate = formatDate(newMessage.created_at);
  const messagesForUpdate = get(allMessage, formattedDate, []);
  const newMessages = messagesForUpdate.map((item: TMessage) =>
    item.id === newMessage.id ? newMessage : item,
  );
  const updatedMessages = { ...allMessage, [formattedDate]: newMessages };

  return updatedMessages;
};

export const formattedSideBarData = (allUsers: any) => {
  if (!allUsers || allUsers.length === 0) return [];
  const sortedData = [...allUsers]?.sort((a: any, b: any) => {
    const dateA = new Date(a.lastMessage?.created_at || 0).getTime();
    const dateB = new Date(b.lastMessage?.created_at || 0).getTime();
    return dateB - dateA;
  });

  return sortedData;
};

export const getLastMessagePreview = (lastMessage: unknown): string => {
  if (!lastMessage) return "";
  if (typeof lastMessage === "string") return lastMessage;

  if (typeof lastMessage === "object") {
    const msg = lastMessage as Record<string, unknown>;
    const text = msg.text ?? msg.content ?? msg.message;
    if (typeof text === "string" && text.trim()) return text;
    if (msg.image) return "Photo";
    if (msg.audio) return "Audio message";
    if (msg.file) return "File";
  }

  return "";
};

export const getLastMessageTime = (lastMessage: unknown, fallback = ""): string => {
  if (!lastMessage || typeof lastMessage !== "object") return fallback;
  const createdAt = (lastMessage as { created_at?: string }).created_at;
  if (!createdAt) return fallback;

  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return fallback;

  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};
