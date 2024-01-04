import { useRoutes } from "react-router-dom";
import Homepage from "../components/Homepage";
// import Home from "../components/Homepage";

export const Router = () => {
  return useRoutes([
    {
      path: "/home",
      children: [
        {
          path: "/home",
          element: <Homepage />,
        },
      ],
    },
  ]);
};
