/* eslint-disable @typescript-eslint/no-explicit-any */
import { get } from "lodash";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
export const CCard = ({ formattedData, selectedEmoji }: any) => {
  const data = get(formattedData, selectedEmoji, []);
  return (
    <>
      {data.map((d: any) => {
        const { emoji, img, name, _id, userId } = d;
        return (
          <Stack
            direction="row"
            spacing={4}
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              minWidth: "500px",
            }}
          >
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
              onClick={() => window.open(`/profile/${userId}`, "_blank")}
            >
              <Avatar alt={name} src={img} />

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
                    Click to view profile
                  </Typography>
                </CardContent>
              </Box>
            </Card>
            <Tooltip title="For remove click on the icon">
              <Typography
                onClick={() => console.log("emoji id ", _id)}
                variant="h4"
                sx={{ cursor: "pointer" }}
              >
                {emoji}
              </Typography>
            </Tooltip>
          </Stack>
        );
      })}
    </>
  );
};
