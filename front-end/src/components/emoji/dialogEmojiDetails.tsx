/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { SET_EMOJI_DETAILS_DIALOG_STATUS } from "../../redux/features/chat/getConversationSlice";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  IconButton,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";
import { formateEmojiDialogData } from "../../utils/common";
import { useMemo, useState } from "react";
import { get } from "lodash";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
const CCard = ({ formattedData, selectedEmoji }: any) => {
  const data = get(formattedData, selectedEmoji, []);
  return (
    <>
      {data.map((d: any) => {
        const { emoji, img, name, _id, userId } = d;
        console.log({ d });
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
              //   onClick={() => onClick(use r)}
            >
              <Avatar
                alt={name}
                src={img || `https://randomuser.me/api/portraits/men/3.jpg`}
              />

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

            <Typography variant="h4">{emoji}</Typography>
          </Stack>
        );
      })}
    </>
  );
};
export default function EmojiDetailsDialog() {
  const [selectedEmoji, setSelectedEmoji] = useState("All");
  const { emojiDetailsDialogStatus, selectedReactions = [] } = useSelector(
    (state: RootState) => state?.message
  );
  const { allUsers = [] } = useSelector((state: RootState) => state?.auth);
  const dispatch = useDispatch();
  const formattedData = useMemo(() => {
    const rr = formateEmojiDialogData(selectedReactions, allUsers);
    return rr;
  }, [selectedReactions]);
  return (
    <>
      <BootstrapDialog
        open={emojiDetailsDialogStatus}
        aria-labelledby="customized-dialog-title"
        onClose={() => dispatch(SET_EMOJI_DETAILS_DIALOG_STATUS(false))}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            textAlign: "center",
            fontSize: "25px",
            fontWeight: 600,
          }}
          id="customized-dialog-title"
        >
          Message reactions
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => dispatch(SET_EMOJI_DETAILS_DIALOG_STATUS(false))}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <Divider />
        <DialogContent>
          <Stack
            direction="row"
            spacing={4}
            sx={{
              justifyContent: "flex-start",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            {Object.keys(formattedData).map((a) => {
              const v = get(formattedData, a, []);
              return (
                <Typography
                  onClick={() => setSelectedEmoji(a)}
                  sx={{ cursor: "pointer" }}
                  variant="h5"
                >
                  {a} {v?.length}
                </Typography>
              );
            })}
          </Stack>

          <CCard formattedData={formattedData} selectedEmoji={selectedEmoji} />
        </DialogContent>
      </BootstrapDialog>
    </>
  );
}
