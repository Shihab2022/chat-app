import toast from "react-hot-toast";
import { FAILED, INFO, SUCCESS, WARNING } from "../constants/common";

export function showToast(type, message) {
  let parsedMessage = "";
  if (typeof message === "string") {
    parsedMessage = message;
  } else {
    parsedMessage = JSON.stringify(message);
  }
  const notify = () => {
    switch (type) {
      case SUCCESS:
        toast.success(parsedMessage, { position: "top-right" });
        break;
      case FAILED:
        toast.error(parsedMessage, { position: "top-right" });
        break;
      case WARNING:
        toast.error(parsedMessage, { position: "top-right" });
        break;
      case INFO:
        toast.success(parsedMessage, { position: "top-right" });
        break;

      default:
        toast.success(parsedMessage, { position: "top-right" });
    }
  };

  return notify();
}
