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
import { Box, Checkbox } from "@mui/material";
import { all } from "axios";
import { TUser } from "../../types";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const ForwardMessage = ({ mess, forwardMenuOpen, setForwardMenuOpen }: any) => {
  const { loginUser, allUsers } = useSelector(
    (state: RootState) => state?.auth
  );
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const handleToggle = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
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
              .filter((user: TUser) => user._id !== loginUser._id)
              .map((user: TUser) => {
                const { _id, name, img } = user;
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
                      checked={selectedUsers.includes(_id)}
                      onChange={() => handleToggle(_id)}
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
              //   handleDeleteMessage();
            }}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ForwardMessage;
