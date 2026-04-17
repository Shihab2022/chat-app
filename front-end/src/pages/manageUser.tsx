import { Typography } from "@mui/material";
import ChattyTable from "../components/table";
interface User {
  name: string;
  age: number;
  city: string;
}

const columns: {
  id: keyof User;
  label: string;
  align?: "left" | "right" | "center";
}[] = [
  { id: "name", label: "Name" },
  { id: "age", label: "Age", align: "right" },
  { id: "city", label: "City" },
] as const;

const rows: User[] = [
  { name: "Shihab", age: 25, city: "Dhaka" },
  { name: "Rahim", age: 30, city: "Rajshahi" },
  { name: "Karim", age: 28, city: "Chittagong" },
];

const ManageUser = () => {
  return (
    <>
      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
        Manage Users
        <ChattyTable rows={rows} columns={columns} />
      </Typography>
    </>
  );
};

export default ManageUser;
