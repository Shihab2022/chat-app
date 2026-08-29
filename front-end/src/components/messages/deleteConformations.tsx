/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteMessage } from "../../services/message";
import { DELETE_MESSAGE } from "../../redux/features/chat/conversationSlice";
import { showToast } from "../../utils/toast";
import { COMMON_ERROR_MESSAGE, FAILED } from "../../constants/common";
import ConfirmModal from "../ui/ConfirmModal";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

const DeleteConformations = ({
  mess,
  deleteConformationMenuOpen,
  setDeleteConformationMenuOpen,
}: any) => {
  const dispatch = useDispatch();
  const [deleting, setDeleting] = useState(false);

  const handleDeleteMessage = async () => {
    setDeleting(true);
    try {
      const res = await deleteMessage(mess);
      if (res?.success) {
        dispatch(DELETE_MESSAGE(res?.data));
      }
    } catch (error) {
      console.error(error);
      showToast(FAILED, COMMON_ERROR_MESSAGE);
    } finally {
      setDeleting(false);
      setDeleteConformationMenuOpen(false);
    }
  };

  return (
    <ConfirmModal
      open={deleteConformationMenuOpen}
      onClose={() => setDeleteConformationMenuOpen(false)}
      onConfirm={handleDeleteMessage}
      title="Delete this message?"
      description="This message will be permanently removed for everyone in the conversation. This action cannot be undone."
      confirmText="Delete"
      cancelText="Cancel"
      danger
      loading={deleting}
      icon={<DeleteOutlineRoundedIcon sx={{ fontSize: 28 }} />}
    />
  );
};

export default DeleteConformations;

