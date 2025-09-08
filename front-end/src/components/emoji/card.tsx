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
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
export const CCard = ({ formattedData, selectedEmoji }: any) => {
  const { loginUser } = useSelector((state: RootState) => state?.auth);
  const { _id: myId } = loginUser;
  const data = get(formattedData, selectedEmoji, []);
  const removeEmoji = (id: string) => {
    console.log({ id });
  };
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

            {userId === myId && (
              <Typography
                variant="h6"
                component="a"
                href="#"
                sx={{
                  cursor: "pointer",
                  color: "primary.main",
                  textDecoration: "underline",
                  fontSize: "15px",
                }}
                onClick={() => {
                  removeEmoji(_id);
                }}
              >
                Remove
              </Typography>
            )}
            <Tooltip title="For remove click on the icon">
              <Typography variant="h4">{emoji}</Typography>
            </Tooltip>
          </Stack>
        );
      })}
    </>
  );
};
