/* eslint-disable @typescript-eslint/no-explicit-any */
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { Stack } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { StyledBadge } from "./StyledBadge";
import TypingIndicator from "./messages/TypingIndicator";

export default function LeftSiteBarCard({
  onClick,
  user,
}: {
  onClick?: any;
  user: any;
}) {
  const { activeUsers = [] } = useSelector((state: RootState) => state?.auth);
  const { name, img, id, email, isTyping = false, lastMessage = {} } = user;
  console.log({ user });
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
      onClick={() => onClick(user)}
    >
      {activeUsers?.includes(id.toString()) ? (
        <Stack direction="row" spacing={2}>
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
          >
            <Avatar alt={name} src={img} />
          </StyledBadge>
        </Stack>
      ) : (
        <Avatar alt={name} src={img} />
      )}

      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography component="div" variant="h6">
            {name}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
            sx={{ fontSize: "12px" }}
          >
            {email}
          </Typography>
          {isTyping ? (
            <TypingIndicator />
          ) : (
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
              sx={{ fontSize: "15px" }}
            >
              {lastMessage?.text?.length > 20
                ? lastMessage?.text?.slice(0, 20) + "..."
                : lastMessage?.text}
              {/* {activeUsers?.includes(id) ? "Online" : "Offline"} */}
            </Typography>
          )}
        </CardContent>
      </Box>
    </Card>
  );
}
