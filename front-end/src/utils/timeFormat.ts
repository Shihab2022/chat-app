/* eslint-disable @typescript-eslint/no-explicit-any */

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
    const dateObj = new Date(msg.created_at);
    const formattedDate = formatDate(dateObj);
    if (!groups[formattedDate]) {
      groups[formattedDate] = [];
    }
    groups[formattedDate].push(msg);

    return groups;
  }, {});
}

export function addMessageToGroups(groups: any, msg: any) {
  const dateObj = new Date(msg.created_at);

  const formattedDate = formatDate(dateObj);
  if (!groups[formattedDate]) {
    groups[formattedDate] = [];
  }

  // Add the message
  groups[formattedDate].push(msg);

  return groups;
}
export function formatFirstMessage(msg: any) {
  const dateObj = new Date(msg.created_at);
  const formattedDate = formatDate(dateObj);

  return {
    [formattedDate]: [msg],
  };
}
