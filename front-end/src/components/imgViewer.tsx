/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, Tooltip } from "@mui/material";
export const ImgViewer = ({
  img,
  tooltipText,
}: {
  img?: string;
  tooltipText: string;
}) => {
  return (
    <Tooltip title={tooltipText}>
      <Avatar
        src={img}
        alt={tooltipText}
        sx={{
          width: 32,
          height: 32,
          fontWeight: 600,
          fontSize: "0.85rem",
        }}
      >
        {tooltipText?.slice(0, 1).toUpperCase()}
      </Avatar>
    </Tooltip>
  );
};
