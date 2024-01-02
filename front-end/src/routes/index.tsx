import { useRoutes } from "react-router-dom";
import Home from "../components/Homepage";

export const Router = () => {
  return useRoutes([
    {
      path: "/home",
      children: [
        {
          path: "/home",
          element: <Home title="Hello" />,
        },
      ],
    },
  ]);
};
