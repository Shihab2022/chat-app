import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";

const Loader = ({
  loading = false,
  title = "Loading...",
}: {
  loading?: boolean;
  title?: string;
}) => {
  return (
    <Backdrop
      sx={{
        color: (theme) => theme.palette.text.primary,
        display: "flex",
        flexDirection: "column",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      open={loading}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1.5,
          px: 4,
          py: 3.5,
          borderRadius: 4,
          backgroundColor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          boxShadow: (theme) => `0 12px 40px ${theme.palette.common.black}22`,
        }}
      >
        <CircularProgress color="primary" size={30} />
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
      </Box>
    </Backdrop>
  );
};

export default Loader;
