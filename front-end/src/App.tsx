import { Toaster } from "react-hot-toast";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import UserRoutes from "./routes/index";
import { GoogleOAuthProvider } from "@react-oauth/google";
const router = createBrowserRouter([{ path: "*", Component: UserRoutes }]);
function App() {
  return (
    <>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <Toaster toastOptions={{ duration: 5000 }} />
        <RouterProvider router={router} />
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
