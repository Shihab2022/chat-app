/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { forwardRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Stack from "@mui/material/Stack/Stack";
import Avatar from "@mui/material/Avatar/Avatar";
import Typography from "@mui/material/Typography/Typography";
import { Checkbox } from "@mui/material";
import { TUser } from "../../types";
import { showToast } from "../../utils/toast";
import { WARNING } from "../../constants/common";
import { forwardMessageAPI } from "../../services/message";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const ForwardMessage = ({ mess, forwardMenuOpen, setForwardMenuOpen }: any) => {
  const { loginUser, allUsers } = useSelector(
    (state: RootState) => state?.auth,
  );
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const handleToggle = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id],
    );
  };
  const handleForwardMessage = async () => {
    if (selectedUsers.length === 0) {
      showToast(
        WARNING,
        "Please select at least one user to forward the message",
      );
      return;
    }
    try {
      const params = {
        text: mess?.text,
        receiverIds: selectedUsers,
        sender_id: loginUser.id,
      };
      const response = await forwardMessageAPI(params);
      if (response.success) {
        showToast("Message forwarded successfully", "success");
      } else {
        showToast("Failed to forward message", "error");
      }
    } catch (error) {
      showToast("An error occurred while forwarding the message", "error");
    }
  };
  return (
    <>
      <Dialog
        open={forwardMenuOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setForwardMenuOpen(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Forward Message to your friends</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {allUsers
              .filter((user: TUser) => user.id !== loginUser.id)
              .map((user: TUser) => {
                const { id, name, img } = user;
                return (
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                      height: "100%",
                      color: "#000",
                      marginY: "10px",
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                    >
                      <Avatar alt={name} src={img} />

                      <Typography component="div" variant="body1">
                        {name}
                      </Typography>
                    </Stack>
                    <Checkbox
                      checked={selectedUsers.includes(id)}
                      onChange={() => handleToggle(id)}
                    />
                  </Stack>
                );
              })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setForwardMenuOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              setForwardMenuOpen(false);
              handleForwardMessage();
            }}
            color="primary"
          >
            Forward
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ForwardMessage;
