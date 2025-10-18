/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { confirmAccountApi } from "../services/auth";
import { useEffect } from "react";
export default function ConfirmAccount() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const urlSearchParams = new URLSearchParams(search);
  const token = urlSearchParams.get("token"); //we send token on the backend the check token and send email to the front end
  const onSubmit = async () => {
    try {
      const response = await confirmAccountApi({ token });
      console.log({ response });
      //   if (response?.data?.accessToken) {
      //     navigate("/chat");
      //   }
    } catch (error) {
      console.error("❌ Error sending invite:", error);
    }
  };
  useEffect(() => {
    onSubmit();
  }, []);
  return (
    <>
      <Button
        onClick={onSubmit}
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Confirm and Login
      </Button>
    </>
  );
}
