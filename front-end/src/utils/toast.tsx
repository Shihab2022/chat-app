import toast from "react-hot-toast";
import { FAILED, INFO, SUCCESS, WARNING } from "../constants/common";

/* Toast styling aligned with the Chatty design system (dark premium theme). */
const baseStyle: React.CSSProperties = {
  background: "#1E2430",
  color: "#E7EAF0",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 12,
  boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
  fontSize: "0.875rem",
  fontWeight: 500,
  padding: "10px 14px",
  maxWidth: "calc(100vw - 32px)",
};

const successIconTheme = { primary: "#2DD4A7", secondary: "#10231D" };
const errorIconTheme = { primary: "#F4526A", secondary: "#2A1418" };

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
          iconTheme: { primary: "#F5A623", secondary: "#2A2010" },
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
