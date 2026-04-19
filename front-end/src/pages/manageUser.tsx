/* eslint-disable @typescript-eslint/no-explicit-any */
import { Chip, Typography } from "@mui/material";
import ChattyTable from "../components/table";
import { getFriends } from "../services/auth";
import { useEffect, useState } from "react";
import { formatDate } from "../utils/timeFormat";
import { FriendshipStatus } from "../constants/common";
interface User {
  receiver_email: string;
  invite_status: string;
  is_blocked: boolean;
  created_at: string;
  update_status: string;
}

const columns: {
  id: keyof User;
  label: string;
  align?: "left" | "right" | "center";
  format?: any;
}[] = [
  { id: "receiver_email", label: "Receiver Email" },
  {
    id: "invite_status",
    label: "Invite Status",
    align: "right",
    format: (value: any) => {
      return (
        <Chip
          label={value}
          sx={{
            backgroundColor: `${value === FriendshipStatus.ACCEPTED ? "#54d62c29" : value === FriendshipStatus.REJECTED ? "#f32121" : "#7663df"}`,
            color: `${value === FriendshipStatus.ACCEPTED ? "#229A16" : value === FriendshipStatus.REJECTED ? "#f1e6e8" : "#fff"}`,
          }}
        />
      );
    },
  },
  {
    id: "is_blocked",
    label: "Blocked",
    format: (value: any) => {
      return (
        <Chip
          label={value ? "Blocked" : "Active"}
          sx={{
            backgroundColor: `${value ? "#f32121" : "#0aec6129"}`,
            color: `${value ? "#fff" : "#229A16"}`,
          }}
        />
      );
    },
  },
  {
    id: "created_at",
    label: "Created At",
    format: (value: any) => {
      return formatDate(value);
    },
  },
  {
    id: "update_status",
    label: "Update Status",
    format: (value: any, rowValue: User) => {
      console.log({ value, rowValue });
      return formatDate(value);
    },
  },
] as const;

const ManageUser = () => {
  const [friends, userFriends] = useState([]);
  const getFriendsData = async () => {
    const res = await getFriends({});
    if (res?.success) {
      userFriends(res?.data);
    }
  };

  useEffect(() => {
    getFriendsData();
  }, []);
  return (
    <>
      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
        Manage Users
        <ChattyTable rows={friends} columns={columns} />
      </Typography>
    </>
  );
};

export default ManageUser;
