import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import AddIcon from "@mui/icons-material/Add";
export default function Profile({ onClick, user }) {
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
      <Avatar alt="Cindy Baker" src={img} />
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
          </Typography>
        </CardContent>
      </Box>
      <AddIcon />
    </Card>
  );
}
