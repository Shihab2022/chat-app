import { Box, Divider, Typography } from "@mui/material";

export const RightSidebar = () => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Chat Info
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Typography variant="body2">Active Users</Typography>

      {/* Example content */}
      <Box mt={2}>
        <Typography variant="body2">• User 1</Typography>
        <Typography variant="body2">• User 2</Typography>
      </Box>
    </Box>
  );
};
