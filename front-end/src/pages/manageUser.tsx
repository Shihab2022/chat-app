/* eslint-disable @typescript-eslint/no-explicit-any */
import { Typography } from "@mui/material";
import ChattyTable from "../components/table";
import { getFriends } from "../services/auth";
import { useEffect, useState } from "react";
import { formatDate } from "../utils/timeFormat";
interface User {
  receiver_email: string;
  invite_status: string;
  is_blocked: boolean;
  created_at: string;
}

const columns: {
  id: keyof User;
  label: string;
  align?: "left" | "right" | "center";
  format?: any;
}[] = [
  { id: "receiver_email", label: "Receiver Email" },
  { id: "invite_status", label: "Invite Status", align: "right" },
  { id: "is_blocked", label: "Blocked" },
  {
    id: "created_at",
    label: "Created At",
    format: (value: any) => formatDate(value),
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
