import { Toaster } from "react-hot-toast";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import UserRoutes from "./routes/index";
import { NAV_BAR_HEIGHT } from "./constants/common";
const router = createBrowserRouter([{ path: "*", Component: UserRoutes }]);
function App() {
  return (
    <>
      <Toaster
        toastOptions={{ duration: 5000 }}
        containerStyle={{
          top: NAV_BAR_HEIGHT + 5,
        }}
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
