/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, Tooltip } from "@mui/material";
export const ImgViewer = ({
  img,
  tooltipText,
}: {
  img: any;
  tooltipText: string;
}) => {
  return (
    <>
      <Tooltip title={tooltipText}>
        <Avatar sx={{ width: 30, height: 30 }} src={img} />
      </Tooltip>
    </>
  );
};
