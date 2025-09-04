/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { emitStopTyping, emitTyping } from "./socketService";

const useDebouncedText = (receiverId: string, delay: number = 5000) => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!message) return;

    // Immediately emit "typing" when user types
    emitTyping(receiverId);

    // Set up debounce to emit "stopTyping"
    const debounceTimer = setTimeout(() => {
      emitStopTyping(receiverId);
      console.log("✋ stop typing");
    }, delay);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [message, delay, receiverId]);

  const handleInputChange = (v: any) => {
    setMessage(v);
  };

  return { handleInputChange, message };
};

export default useDebouncedText;
