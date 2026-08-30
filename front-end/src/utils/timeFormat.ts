/* eslint-disable @typescript-eslint/no-explicit-any */

import { normalizeMessage } from "./messageNormalize";

export const formatDate = (isoString: Date): string => {
  const d = new Date(isoString);
  const today = new Date();
  const toLocalDateOnly = (dt: Date) =>
    new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
  const dOnly = toLocalDateOnly(d);
  const todayOnly = toLocalDateOnly(today);

  const msPerDay = 24 * 60 * 60 * 1000;
  const diffInDays = Math.round(
    (todayOnly.getTime() - dOnly.getTime()) / msPerDay,
  );

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays >= 2 && diffInDays <= 6) {
    return d.toLocaleDateString("en-US", { weekday: "long" });
  }
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const weekday = d.toLocaleDateString("en-US", { weekday: "long" });

  return `${day}/${month}/${year} (${weekday})`;
};

export const formatTimes: any = (isoString: any) => {
  const dateObj = new Date(isoString);
  const formattedTime = dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return formattedTime;
};

export function groupMessagesByDate(messages: any) {
  return messages.reduce((groups: any, msg: any) => {
    const normalized = normalizeMessage(msg);
    const dateObj = new Date(normalized.created_at);
    const formattedDate = formatDate(dateObj);
    if (!groups[formattedDate]) {
      groups[formattedDate] = [];
    }
    groups[formattedDate].push(normalized);

    return groups;
  }, {});
}

export function addMessageToGroups(groups: any, msg: any) {
  const normalized = normalizeMessage(msg);
  const dateObj = new Date(normalized.created_at);
  const formattedDate = formatDate(dateObj);
  const nextGroups = { ...groups };

  if (!nextGroups[formattedDate]) {
    nextGroups[formattedDate] = [];
  }

  const msgId = String(normalized.id ?? "");
  const senderId = String(normalized.sender_id ?? "");
  const msgText = normalized.text ?? "";

  for (const dateKey of Object.keys(nextGroups)) {
    const existingIdx = nextGroups[dateKey].findIndex(
      (existing: any) => String(existing.id) === msgId,
    );
    if (existingIdx >= 0) {
      const updated = [...nextGroups[dateKey]];
      updated[existingIdx] = { ...updated[existingIdx], ...normalized };
      return { ...nextGroups, [dateKey]: updated };
    }

    const optimisticIdx = nextGroups[dateKey].findIndex(
      (existing: any) =>
        String(existing.id).startsWith("local-") &&
        String(existing.sender_id) === senderId &&
        (existing.text ?? "") === msgText,
    );
    if (optimisticIdx >= 0) {
      const updated = [...nextGroups[dateKey]];
      updated[optimisticIdx] = { ...normalized, seen: normalized.seen ?? updated[optimisticIdx].seen };
      return { ...nextGroups, [dateKey]: updated };
    }
  }

  nextGroups[formattedDate] = [...nextGroups[formattedDate], normalized];
  return nextGroups;
}
export function formatFirstMessage(msg: any) {
  const normalized = normalizeMessage(msg);
  const dateObj = new Date(normalized.created_at);
  const formattedDate = formatDate(dateObj);

  return {
    [formattedDate]: [normalized],
  };
}
