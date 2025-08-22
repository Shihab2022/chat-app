/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { formatTimes } from "../../utils/timeFormat";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useState } from "react";
const ImgViewer = ({ img }: { img: any }) => {
  return (
    <>
      <Avatar sx={{ width: 24, height: 24 }} src={img} />
    </>
  );
};
const ShowingMessage = ({ mess, messageEndRef }: any) => {
  const { text, senderId, createdAt } = mess;
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { loginUser, allUsers } = useSelector(
    (state: RootState) => state?.auth
  );
  const { _id: myId } = loginUser;
  const userInfo = allUsers.find((user: any) => user._id === senderId);
  console.log({ isHovered });
  console.log({ isMenuOpen });
  const isOwn = mess.senderId === myId;
  const time = formatTimes(createdAt);
  return (
    <>
      <Stack
        direction="row"
        justifyContent={`${mess.senderId === myId ? "flex-end" : "flex-start"}`}
        alignItems="center"
        spacing={2}
        sx={{ marginY: "10px" }}
        ref={messageEndRef}
      >
        <Stack
          direction={`${mess.senderId === myId ? "row-reverse" : "row"}`}
          justifyContent="flex-start"
          alignItems="center"
          spacing={2}
          sx={{ width: "75%" }}
        >
          <ImgViewer img={userInfo?.img} />
          <Box
            key={mess._id}
            sx={{
              display: "flex",
              justifyContent: isOwn ? "flex-start" : "flex-end",
              mb: 1,
            }}
          >
            <Paper
              elevation={1}
              sx={{
                paddingX: 1.5,
                paddingY: 1,
                borderRadius: 2,
                backgroundColor: isOwn ? "#DCF8C6" : "#fff",
              }}
            >
              <Stack
                direction={isOwn ? "row-reverse" : "row"}
                spacing={2}
                sx={{
                  justifyContent: "flex-start",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <Typography variant="body1">{text}</Typography>
                <div
                  style={{
                    position: "relative",
                    display: "inline-block",
                  }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      textAlign: "right",
                      mt: 0.5,
                      opacity: isHovered ? 0.3 : 0.7, // fade when hovered
                      fontSize: "10px",
                      cursor: "pointer",
                      transition: "opacity 0.3s ease, filter 0.3s ease",
                      filter: isHovered ? "blur(5px)" : "none", // optional blur
                    }}
                  >
                    {time || "10:30 PM"}
                  </Typography>

                  {/* {isHovered && (
                    <IconButton
                      onClick={(e) => {
                        setAnchorEl(e);
                        setMenuOpen(!isMenuOpen);
                      }}
                      // sx={{ p: "10px" }}
                      aria-label="menu"
                    >
                      <KeyboardArrowDownIcon
                        // onClick={(e) => {
                        //   setAnchorEl(e);
                        //   setMenuOpen(!isMenuOpen);
                        // }}
                        sx={{
                          fontSize: 40,
                          color: "#000",
                          position: "absolute",
                          top: "50%",
                          transition: "all 0.3s ease",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                          ...(isOwn ? { left: 0 } : { right: 0 }),
                        }}
                      />
                    </IconButton>
                  )} */}
                </div>
              </Stack>
            </Paper>
          </Box>
        </Stack>
      </Stack>

      <Menu
        id="basic-menu"
        open={isMenuOpen}
        anchorEl={anchorEl}
        onClose={() => {
          // dispatch(SET_EMOJI_ANCHOR_EL(null));
          // dispatch(SET_EMOJI_STATUS(!isEmojiOpen));
        }}
      >
        <MenuItem>Profile</MenuItem>
      </Menu>
    </>
  );
};

export default ShowingMessage;
