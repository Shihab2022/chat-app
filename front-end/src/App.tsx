import { Button } from "@mui/material";
import React, { FC } from "react";
import { BrowserRouter, Route, RouterProvider, Routes, createBrowserRouter } from "react-router-dom";
import Homepage from "./components/Homepage";

function App() {
  // const router = createBrowserRouter([{ path: "*", Component: UserRoutes }]);
  return (
    <>
      {/* <Button variant="text">Text</Button>
      <Button variant="contained">Contained</Button>
      <Button variant="outlined">Outlined</Button> */}
      {/* <RouterProvider router={router} /> */}
      {/* <BrowserRouter> */}
      <Routes>

      <Route path="/home" element={<Homepage />} />
        </Routes>
      </Routes>
    {/* </BrowserRouter> */}
    </>
  );
}

export default App;
