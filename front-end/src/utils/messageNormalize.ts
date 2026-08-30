/* eslint-disable @typescript-eslint/no-explicit-any */
import { GroupedMessages, Reaction, TMessage } from "../types";

export const normalizeMessage = (msg: any): TMessage => {
  if (!msg) return msg;

  let reactions: Reaction[] = [];
  const rawReactions = msg.reactions;
  if (Array.isArray(rawReactions)) {
    reactions = rawReactions;
  } else if (typeof rawReactions === "string") {
    try {
      reactions = JSON.parse(rawReactions);
    } catch {
      reactions = [];
    }
  }

  return {
    ...msg,
    id: String(msg.id),
    sender_id: String(msg.sender_id),
    receiverId: String(msg.receiver_id ?? msg.receiverId ?? ""),
    replyId: msg.reply_id ? String(msg.reply_id) : msg.replyId,
    isDeleted: Boolean(msg.is_deleted ?? msg.isDeleted),
    image: msg.image || undefined,
    file: msg.file_url ?? msg.file,
    fileName: msg.file_name ?? msg.fileName,
    fileType: msg.file_type ?? msg.fileType,
    seen: msg.seen ?? false,
    seen_at: msg.seen_at,
    reactions: (reactions || []).map((reaction: any) => ({
      id: reaction.id || `${msg.id}-${reaction.userId || reaction.user_id}`,
      userId: String(reaction.userId || reaction.user_id),
      emoji: reaction.emoji,
    })),
  };
};

export const normalizeMessages = (messages: any[] = []): TMessage[] =>
  messages.map(normalizeMessage);

export const normalizeGroupedMessages = (
  groups: GroupedMessages,
): GroupedMessages => {
  const result: GroupedMessages = {};
  Object.entries(groups || {}).forEach(([date, msgs]) => {
    result[date] = normalizeMessages(msgs);
  });
  return result;
};
