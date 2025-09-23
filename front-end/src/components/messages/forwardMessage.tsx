/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { forwardRef } from "react";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const ForwardMessage = ({ mess, forwardMenuOpen, setForwardMenuOpen }: any) => {
  return (
    <>
      <Dialog
        open={forwardMenuOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setForwardMenuOpen(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Are you sure you want to delete this message?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {mess?.text}
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
