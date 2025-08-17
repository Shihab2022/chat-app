/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { Stack } from "@mui/material";
import { randomTwoDigit, toStartCaseStr } from "../utils/common";
import { StyledBadge } from "./StyledBadge";

export default function Profile({ user }: { user: any }) {
  const navigate = useNavigate();
  const { name, img, email } = user;

  return (
    <Card
      elevation={0}
      sx={{
        display: "flex",
        direction: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        spacing: 2,
        width: "100%",
        paddingLeft: "20px",
        cursor: "pointer",
      }}
    >
      <Stack direction="row" spacing={2}>
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
        >
          <Avatar
            alt={name}
            src={
              img ||
              `https://randomuser.me/api/portraits/men/${randomTwoDigit()}.jpg`
            }
          />
        </StyledBadge>
      </Stack>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography component="div" variant="h6">
            {toStartCaseStr(name)}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
          >
            {email}
          </Typography>
        </CardContent>
      </Box>
      <AddIcon onClick={() => navigate("/inviteUser", { state: { user } })} />
    </Card>
  );
}
