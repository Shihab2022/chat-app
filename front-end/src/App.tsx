import { Button } from "@mui/material";
import React, { FC } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
const router = createBrowserRouter([{ path: "*", Component: UserRoutes }]);
function App(): FC {
  return (
    <>
      {/* <Button variant="text">Text</Button>
      <Button variant="contained">Contained</Button>
      <Button variant="outlined">Outlined</Button> */}
      <RouterProvider router={router} />
    </>
  );
}

export default App;
