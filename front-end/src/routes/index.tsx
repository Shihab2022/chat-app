import { useRoutes } from "react-router-dom";
// import LandingPage from "../components/homePage";
import ChatContainer from "../pages/messages";
import ProtectedRoute from "./privateRoute";
import SignUp from "../pages/login/registerPage";
import SignIn from "../pages/login/login";
import ForgetPassword from "../pages/login/forgetPassword";
import InviteUser from "../components/inviteFriend";
import Profile from "../components/profile";
import NotFoundPage from "../404";
import NavBar from "../pages/messages/navBar";
import AcceptInvite from "../pages/acceptInvite";
import UpdatePassword from "../pages/updatePassword";
import ConfirmAccount from "../pages/confirmAccount";
import ResendEmail from "../pages/reSendConfirm";
import ManageUser from "../pages/manageUser";
import { HomePage } from "../pages/home";

export default function Router() {
  return useRoutes([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/chat",
      children: [
        {
          path: "/chat",
          element: (
            <ProtectedRoute>
              <NavBar isDrawer>
                <ChatContainer />
              </NavBar>
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: "/inviteUser",
      element: (
        <ProtectedRoute>
          <InviteUser />
        </ProtectedRoute>
      ),
    },
    {
      path: "/manageUser",
      element: (
        <ProtectedRoute>
          <NavBar>
            <ManageUser />
          </NavBar>
        </ProtectedRoute>
      ),
    },
    {
      path: "/profile/:userId",
      element: (
        <ProtectedRoute>
          <NavBar>
            <Profile />
          </NavBar>
        </ProtectedRoute>
      ),
    },
    {
      path: "/SignUp",
      element: <SignUp />,
    },
    {
      path: "/login",
      element: <SignIn />,
    },
    {
      path: "/forgetPassword",
      element: <ForgetPassword />,
    },
    {
      path: "/update-password",
      element: <UpdatePassword />,
    },
    {
      path: "/accept-invite",
      element: <AcceptInvite />,
    },
    {
      path: "/confirm",
      element: <ConfirmAccount />,
    },
    {
      path: "/re-send-confirm",
      element: <ResendEmail />,
    },
    { path: "*", element: <NotFoundPage /> },
  ]);
}
