/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { FAILED } from "../../constants/common";
import googleImage from "../../assets/google.png";
import Box from "@mui/material/Box/Box";
import Button from "@mui/material/Button/Button";
import Typography from "@mui/material/Typography/Typography";
import { showToast } from "../../utils/toast";
const GoogleLoginCom = ({ handleClick }: any) => {
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse?.access_token}`,
            },
          },
        );
        const {
          email,
          family_name,
          given_name,
          picture = "",
          name,
        } = userInfo?.data ?? {};
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
    <>
      <Box sx={{ textAlign: "center", width: "100%" }}>
        <Button
          onClick={() => handleGoogleLogin()}
          fullWidth
          size="large"
          variant="contained"
          sx={{
            backgroundColor: "#fff",
            color: "#000",
            border: "2px solid #dcdcdc",
            textTransform: "none",
            padding: "10px 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "#f7f7f7",
              boxShadow: "none",
            },
          }}
        >
          <img src={googleImage} alt="Google" width="25" height="25" />
          <Box>
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: "15px",
                marginLeft: "30px",
              }}
            >
              Continue with Google
            </Typography>
          </Box>
        </Button>
      </Box>
    </>
  );
};

export default GoogleLoginCom;
