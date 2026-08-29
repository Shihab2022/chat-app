/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { FAILED } from "../../constants/common";
import googleImage from "../../assets/google.png";
import { alpha, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { showToast } from "../../utils/toast";

const GoogleLoginCom = ({ handleClick }: any) => {
  const theme = useTheme();
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${tokenResponse?.access_token}`,
          },
        });
        const { email, family_name, given_name, picture = "", name } = userInfo?.data ?? {};
        const params = {
          email,
          firstName: given_name || "",
          lastName: family_name || "",
          picture,
          name,
        };
        await handleClick(params);
      } catch (error) {
        showToast(FAILED, "SOMETHING_WENT_WRONG");
      }
    },
    onError: () => {
      showToast(FAILED, "Login Failed");
    },
  });

  return (
    <Box sx={{ width: "100%" }}>
      <Button
        onClick={() => handleGoogleLogin()}
        fullWidth
        size="large"
        variant="outlined"
        sx={{
          py: 1.3,
          borderRadius: 10,
          borderColor: "rgba(255,255,255,0.16)",
          color: theme.palette.text.primary,
          backgroundColor: alpha(theme.palette.common.white, 0.035),
          "&:hover": {
            backgroundColor: alpha(theme.palette.common.white, 0.08),
            borderColor: "rgba(255,255,255,0.28)",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.9 }}>
          <img src={googleImage} alt="Google" width="20" height="20" />
          <Typography
            component="span"
            sx={{ fontWeight: 600, fontSize: "0.9rem", color: "inherit" }}
          >
            Continue with Google
          </Typography>
        </Box>
      </Button>
    </Box>
  );
};

export default GoogleLoginCom;