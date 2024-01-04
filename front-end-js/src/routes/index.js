import { Navigate, useRoutes } from "react-router-dom";
import Homepage from "./../../../front-end/src/components/Homepage/index";

export default function Router() {
  return useRoutes([
    {
      path: "/home",
      element: <Homepage />,
      // children: [
      //   { path: "/", element: <Navigate to="/dashboard" /> },
      //   { path: "login", element: <Login /> },
      //   { path: "register", element: <Signup /> },
      //   { path: "forgot-password", element: <ForgotPassword /> },
      //   { path: "reset-password", element: <ResetPassword /> },
      //   { path: "confirm-account", element: <ConfirmAccount /> },
      //   { path: "accept-invite", element: <AcceptInvite /> },
      //   { path: "404", element: <NotFound /> },
      //   { path: "*", element: <Navigate to="/404" /> },
      // ],
    },
    //   { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}
