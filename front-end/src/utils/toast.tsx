import toast from "react-hot-toast";
import { FAILED, INFO, SUCCESS, WARNING } from "../constants/common";

/* Toast styling aligned with the Chatty light design system. */
const baseStyle: React.CSSProperties = {
  background: "#FFFFFF",
  color: "#111B21",
  border: "1px solid #E4E6EB",
  borderRadius: 12,
  boxShadow: "0 4px 16px rgba(15,23,42,0.10), 0 12px 32px rgba(15,23,42,0.14)",
  fontSize: "0.875rem",
  fontWeight: 500,
  padding: "10px 14px",
  maxWidth: "calc(100vw - 32px)",
};

const successIconTheme = { primary: "#00A884", secondary: "#FFFFFF" };
const errorIconTheme = { primary: "#D93025", secondary: "#FFFFFF" };

export function showToast(type: string, message: string) {
  let parsedMessage = "";
  if (typeof message === "string") {
    parsedMessage = message;
  } else {
    parsedMessage = JSON.stringify(message);
  }
  const notify = () => {
    switch (type) {
      case SUCCESS:
        toast.success(parsedMessage, {
          position: "top-right",
          style: baseStyle,
          iconTheme: successIconTheme,
        });
        break;
      case FAILED:
        toast.error(parsedMessage, {
          position: "top-right",
          style: baseStyle,
          iconTheme: errorIconTheme,
        });
        break;
      case WARNING:
        toast.error(parsedMessage, {
          position: "top-right",
          style: baseStyle,
          iconTheme: { primary: "#B26A00", secondary: "#FFFFFF" },
        });
        break;
      case INFO:
        toast(parsedMessage, {
          position: "top-right",
          style: baseStyle,
          icon: "💬",
        });
        break;

      default:
        toast.success(parsedMessage, {
          position: "top-right",
          style: baseStyle,
          iconTheme: successIconTheme,
        });
    }
  };

  return notify();
}
