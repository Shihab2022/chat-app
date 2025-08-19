/* eslint-disable @typescript-eslint/no-explicit-any */
export const formatDate: any = (isoString: string) => {
  const dateObj = new Date(isoString);
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
  const year = dateObj.getFullYear();
  const weekday = dateObj.toLocaleDateString("en-US", { weekday: "long" });

  const formattedDate = `${day}/${month}/${year} (${weekday})`;

  return formattedDate;
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
    const dateObj = new Date(msg.createdAt);
    const formattedDate = formatDate(dateObj);
    if (!groups[formattedDate]) {
      groups[formattedDate] = [];
    }
    groups[formattedDate].push(msg);

    return groups;
  }, {});
}

export function addMessageToGroups(groups: any, msg: any) {
  const dateObj = new Date(msg.createdAt);

  const formattedDate = formatDate(dateObj);
  if (!groups[formattedDate]) {
    groups[formattedDate] = [];
  }

  // Add the message
  groups[formattedDate].push(msg);

  return groups;
}
export function formatFirstMessage(msg: any) {
  const dateObj = new Date(msg.createdAt);
  const formattedDate = formatDate(dateObj);

  return {
    [formattedDate]: [msg],
  };
}
