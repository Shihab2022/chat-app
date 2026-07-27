import React from "react";
import {
  Chat as ChatIcon,
  Security as SecurityIcon,
  VideoCall as VideoCallIcon,
  Groups as GroupsIcon,
  FolderZip as FileIcon,
  NotificationsActive as NotificationIcon,
  PersonAdd as PersonAddIcon,
  // PersonSearchIcon as SearchIcon,
  Forum as ForumIcon,
} from "@mui/icons-material";
import { Feature, Stat, Step, Testimonial, NavLinkItem } from "../types";

export const THEME_COLORS = {
  primary: "#1976D2",
  secondary: "#42A5F5",
  background: "#F5F7FB",
  cardBackground: "#FFFFFF",
  textPrimary: "#1A1A1A",
  textSecondary: "#6B7280",
};

export const FEATURES_DATA: Feature[] = [
  {
    id: "feat-1",
    icon: React.createElement(ChatIcon, {
      fontSize: "large",
      color: "primary",
    }),
    title: "Real-Time Messaging",
    description:
      "Instant message delivery with sub-millisecond latency. Stay synchronized across all mobile and web devices seamlessly.",
  },
  {
    id: "feat-2",
    icon: React.createElement(SecurityIcon, {
      fontSize: "large",
      color: "primary",
    }),
    title: "End-to-End Security",
    description:
      "Military-grade encryption guarantees that your private conversations and media stay completely confidential.",
  },
  {
    id: "feat-3",
    icon: React.createElement(VideoCallIcon, {
      fontSize: "large",
      color: "primary",
    }),
    title: "Voice & Video Calls",
    description:
      "Crystal-clear HD video and spatial audio support for 1-on-1 chats and high-capacity team video conferences.",
  },
  {
    id: "feat-4",
    icon: React.createElement(GroupsIcon, {
      fontSize: "large",
      color: "primary",
    }),
    title: "Group Conversations",
    description:
      "Organize communities, channels, and group chats with customizable roles, permissions, and moderation tools.",
  },
  {
    id: "feat-5",
    icon: React.createElement(FileIcon, {
      fontSize: "large",
      color: "primary",
    }),
    title: "Fast File Sharing",
    description:
      "Drag and drop documents, images, code snippets, and large media files without strict compression limits.",
  },
  {
    id: "feat-6",
    icon: React.createElement(NotificationIcon, {
      fontSize: "large",
      color: "primary",
    }),
    title: "Smart Notifications",
    description:
      "Customizable push notifications, do-not-disturb schedules, and granular channel mute capabilities.",
  },
];

export const STATS_DATA: Stat[] = [
  { id: "stat-1", value: "100K+", label: "Messages Sent Daily" },
  { id: "stat-2", value: "25K+", label: "Active Users" },
  { id: "stat-3", value: "99.99%", label: "Guaranteed Uptime" },
  { id: "stat-4", value: "150+", label: "Countries Reached" },
];

export const STEPS_DATA: Step[] = [
  {
    id: "step-1",
    stepNumber: 1,
    title: "Create Account",
    description:
      "Sign up in seconds with your email or social credentials to set up your profile.",
    icon: React.createElement(PersonAddIcon, { sx: { fontSize: 32 } }),
  },
  {
    id: "step-2",
    stepNumber: 2,
    title: "Find Friends",
    description:
      "Connect with colleagues, friends, or discover public communities aligned with your interests.",
    icon: React.createElement(ForumIcon, { sx: { fontSize: 32 } }),
  },
  {
    id: "step-3",
    stepNumber: 3,
    title: "Start Chatting",
    description:
      "Send messages, launch crystal-clear video calls, and share files instantly without hassle.",
    icon: React.createElement(ForumIcon, { sx: { fontSize: 32 } }),
  },
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: "test-1",
    name: "Sarah Jenkins",
    role: "Product Manager",
    company: "TechFlow Inc.",
    avatarUrl: "https://i.pravatar.cc/150?img=32",
    rating: 5,
    content:
      "This chat platform completely transformed how our remote team communicates. The speed and clean UI are unrivaled.",
  },
  {
    id: "test-2",
    name: "Alex Rivera",
    role: "Lead Developer",
    company: "DevSphere",
    avatarUrl: "https://i.pravatar.cc/150?img=12",
    rating: 5,
    content:
      "The end-to-end security coupled with effortless file sharing makes this my go-to choice for tech collaboration.",
  },
  {
    id: "test-3",
    name: "Elena Rostova",
    role: "Community Lead",
    company: "DesignHub",
    avatarUrl: "https://i.pravatar.cc/150?img=47",
    rating: 5,
    content:
      "Managing a community of over 10,000 members has never been smoother. Channels and permissions are top tier.",
  },
];

export const FOOTER_LINKS: { category: string; links: NavLinkItem[] }[] = [
  {
    category: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Security", href: "#" },
      { label: "Enterprise", href: "#" },
      { label: "Download App", href: "#" },
    ],
  },
  {
    category: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    category: "Resources",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Documentation", href: "#" },
      { label: "Status", href: "#" },
    ],
  },
];
