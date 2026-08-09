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
import { deleteMessage } from "../../services/message";
import { useDispatch } from "react-redux";
import { DELETE_MESSAGE } from "../../redux/features/chat/conversationSlice";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const DeleteConformations = ({
  mess,
  deleteConformationMenuOpen,
  setDeleteConformationMenuOpen,
}: any) => {
  const dispatch = useDispatch();
  const handleDeleteMessage = async () => {
    try {
      const res = await deleteMessage(mess);
      if (res?.success) {
        dispatch(DELETE_MESSAGE(res?.data));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Dialog
        open={deleteConformationMenuOpen}
        slots={{ transition: Transition }}
        keepMounted
        onClose={() => setDeleteConformationMenuOpen(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Are you sure you want to delete this message?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {mess?.text}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConformationMenuOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              setDeleteConformationMenuOpen(false);
              handleDeleteMessage();
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

export default DeleteConformations;
