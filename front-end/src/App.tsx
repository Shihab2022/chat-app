import { Toaster } from "react-hot-toast";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import UserRoutes from "./routes/index";
const router = createBrowserRouter([{ path: "*", Component: UserRoutes }]);
function App() {
  return (
    <>
      <Toaster toastOptions={{ duration: 5000 }} />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
