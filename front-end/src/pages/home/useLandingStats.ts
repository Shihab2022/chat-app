/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { getAllRegisteredUsersAPI } from "../../services/auth";
import { getGroupsAPI, getUsersForSidebar } from "../../services/message";
import { getCallHistoryAPI } from "../../services/call";
import { tokenKey } from "../../constants/common";

export interface LandingStat {
  id: string;
  /** Numeric value rendered in the stat tile. */
  value: number;
  /** Short suffix appended to the number (e.g. "+" or "%"). */
  suffix: string;
  label: string;
  /** Gradient preset key from GRADIENTS. */
  accent: "violet" | "cyan" | "pink" | "emerald";
}

/**
 * Fallback figures shown to signed-out visitors (and whenever the live
 * request fails). Keeps the landing page visually complete without
 * fabricating an API call the guest is not allowed to make.
 */
const FALLBACK_STATS: LandingStat[] = [
  { id: "users", value: 50, suffix: "K+", label: "Active users", accent: "violet" },
  { id: "conversations", value: 1.2, suffix: "M+", label: "Conversations", accent: "cyan" },
  { id: "groups", value: 12, suffix: "K+", label: "Group chats", accent: "pink" },
  { id: "calls", value: 99.9, suffix: "%", label: "Delivery uptime", accent: "emerald" },
];

/** Normalise the many list shapes the API can return into a single count. */
const countFrom = (res: any): number | null => {
  if (!res || res.success === false) return null;
  const payload = res.data;
  if (Array.isArray(payload)) return payload.length;
  if (payload && Array.isArray(payload.rows)) return payload.rows.length;
  if (payload && Array.isArray(payload.calls)) return payload.calls.length;
  if (payload && typeof payload.total === "number") return payload.total;
  return null;
};

/**
 * Reads real dashboard figures (registered users, conversations, groups and
 * call history) from the backend.
 *
 * The relevant endpoints are auth-protected and `apiHandler` hard-redirects
 * guests to `/login` on 401 — so we deliberately skip fetching unless an
 * access token is present.
 */
export const useLandingStats = (): { stats: LandingStat[]; isLive: boolean } => {
  const [stats, setStats] = useState<LandingStat[]>(FALLBACK_STATS);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(tokenKey)) return;

    let cancelled = false;

    (async () => {
      try {
        const [usersRes, groupsRes, conversationsRes, callsRes] = await Promise.all([
          getAllRegisteredUsersAPI({}),
          getGroupsAPI(),
          getUsersForSidebar({}),
          getCallHistoryAPI({}),
        ]);

        if (cancelled) return;

        const users = countFrom(usersRes);
        const groups = countFrom(groupsRes);
        const conversations = countFrom(conversationsRes);
        const calls = countFrom(callsRes);

        const next = FALLBACK_STATS.map((stat) => {
          const live =
            stat.id === "users"
              ? users
              : stat.id === "groups"
              ? groups
              : stat.id === "conversations"
              ? conversations
              : calls;

          // Counts are small integers; only swap in the live figure when it
          // carries a meaningful, non-zero signal.
          if (live === null || live <= 0) return stat;

          if (stat.id === "users") {
            return { ...stat, value: live, suffix: "" };
          }
          if (stat.id === "calls") {
            // Call history length is not an uptime metric — relabel it.
            return { ...stat, value: live, suffix: "", label: "Calls logged" };
          }
          return { ...stat, value: live, suffix: "" };
        });

        const hasLive = [users, groups, conversations, calls].some(
          (v) => typeof v === "number" && v > 0,
        );
        if (hasLive) {
          setStats(next);
          setIsLive(true);
        }
      } catch {
        // Silent — the curated fallback numbers stay on screen.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { stats, isLive };
};