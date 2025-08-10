/* eslint-disable @typescript-eslint/no-explicit-any */
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import { Stack } from "@mui/material";
const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));
export default function LeftSiteBar({
  onClick,
  user,
}: {
  onClick: any;
  user: any;
}) {
  const { name, lastMessage, img, time } = user;
  return (
    <Card
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
      <Stack direction="row" spacing={2}>
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
        >
          <Avatar alt={name} src={img} />
        </StyledBadge>
      </Stack>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography component="div" variant="h6">
            {name}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
          >
            {lastMessage}
            <span> . {time}</span>
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
}
