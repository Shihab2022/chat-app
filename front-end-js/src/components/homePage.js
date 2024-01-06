import { Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import ChatIcon from "@mui/icons-material/Chat";
const LandingPage = () => {
  return (
    <div>
      <h1>Hello this is home page</h1>
      <Link to="/chat">
        <Button variant="contained" endIcon={<ChatIcon />}>
          Chat
        </Button>
      </Link>
      <br></br>
      <Link to="/SignUp">
        <Button variant="contained" endIcon={<ChatIcon />}>
          SignUp
        </Button>
      </Link>
      <br></br>
      <Link to="/login">
        <Button variant="contained" endIcon={<ChatIcon />}>
          login
        </Button>
      </Link>
    </div>
  );
};

export default LandingPage;
