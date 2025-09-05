/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { emitStopTyping, emitTyping } from "./socketService";

const useDebouncedText = (receiverId: string) => {
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (!message && message.length === 0) {
      emitStopTyping(receiverId);
    } else {
      emitTyping(receiverId);
    }
  }, [message, receiverId]);

  const handleInputChange = (v: any) => {
    setMessage(v);
  };
  const stopTypingEvent = () => {
    emitStopTyping(receiverId);
  };
  return { handleInputChange, message, stopTypingEvent };
};

export default useDebouncedText;
