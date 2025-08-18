/* eslint-disable @typescript-eslint/no-explicit-any */
export const formatTime: any = (isoString: string) => {
  const dateObj = new Date(isoString);

  // Format date as DD-MM-YYYY
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
  const year = dateObj.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;

  // Format time as HH:MM AM/PM
  const formattedTime = dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return { date: formattedDate, time: formattedTime };
};

export const formatTimes: any = (isoString: any) => {
  const dateObj = new Date(isoString);
  const formattedTime = dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return formattedTime;
};
