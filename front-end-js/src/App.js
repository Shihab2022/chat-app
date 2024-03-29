import { Route, Routes } from "react-router-dom";
import Homepage from "./components";
import ResponsiveDrawer from "./pages";
import LandingPage from "./components/homePage";
import SignUp from "./pages/login/registerPage";
import SignIn from "./pages/login/login";
import ForgetPassword from "./pages/login/forgetPassword";
import { Toaster } from "react-hot-toast";
import InviteUser from "./components/inviteFriend";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />}></Route>
        <Route path="/home" element={<Homepage />}></Route>
        <Route path="/chat" element={<ResponsiveDrawer />}></Route>
        <Route path="/signUp" element={<SignUp />}></Route>
        <Route path="/login" element={<SignIn />}></Route>
        <Route path="/forgetPassword" element={<ForgetPassword />}></Route>
        <Route path="/inviteUser" element={<InviteUser />}></Route>
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
