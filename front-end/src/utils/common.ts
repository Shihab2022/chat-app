/* eslint-disable @typescript-eslint/no-explicit-any */
import { Reaction, TUser } from "../types";

export const toStartCaseStr = (str: string) => {
  try {
    return str
      .replace(/_/g, " ")
      .replace(/([a-z])([A-Z])/g, (str, $1, $2) => $1 + " " + $2)
      .replace(/(\s|^)(\w)/g, (str, $1, $2) => $1 + $2.toUpperCase());
  } catch (error) {
    return str;
  }
};

export const randomTwoDigit = () =>
  (Math.floor(Math.random() * 9) + 1) * 10 +
  (Math.floor(Math.random() * 9) + 1);

export const formateEmojiDialogData = (
  reactions: Reaction[],
  allUsers: TUser[]
) => {
  // Group reactions by emoji
  const formattedReactions = reactions?.map((r) => {
    const u = allUsers.find((u: TUser) => u?._id === r?.userId);
    return {
      ...r,
      img: u?.img,
      name: u?.name,
    };
  });
  const grouped = reactions.reduce<Record<string, Reaction[]>>((acc, item) => {
    if (!acc[item.emoji]) {
      acc[item.emoji] = [];
    }
    acc[item.emoji].push(item);
    return acc;
  }, {});
  return { All: formattedReactions, ...grouped };
};
