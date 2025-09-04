/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { emitStopTyping, emitTyping } from "./socketService";

const useDebouncedText = (receiverId: string, delay: number = 1000) => {
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (!message && message.length === 0) {
      emitStopTyping(receiverId);
      return;
    }
    const debounceTimer = setTimeout(() => {
      emitTyping(receiverId);
    }, delay);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [message, delay, receiverId]);

  const handleInputChange = (v: any) => {
    setMessage(v);
  };
  const stopTypingEvent = () => {
    emitStopTyping(receiverId);
  };
  return { handleInputChange, message, stopTypingEvent };
};

export default useDebouncedText;
