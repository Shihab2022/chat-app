import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./components/homePage";
import Homepage from "./components";
import ResponsiveDrawer from "./pages";
import SignUp from "./pages/login/registerPage";
import SignIn from "./pages/login/login";
import ForgetPassword from "./pages/login/forgetPassword";
import InviteUser from "./components/inviteFriend";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />}></Route>
        <Route
          path="/home"
          element={<Homepage onClick={undefined} user={undefined} />}
        ></Route>
        <Route path="/chat" element={<ResponsiveDrawer />}></Route>
        <Route path="/signUp" element={<SignUp />}></Route>
        <Route path="/login" element={<SignIn />}></Route>
        <Route path="/forgetPassword" element={<ForgetPassword />}></Route>
        <Route path="/inviteUser" element={<InviteUser />}></Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
