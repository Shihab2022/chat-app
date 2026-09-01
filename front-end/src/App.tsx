import { Toaster } from "react-hot-toast";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import UserRoutes from "./routes/index";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { CallProvider } from "./components/call/CallProvider";
import CallOverlays from "./components/call/CallOverlays";

const router = createBrowserRouter([{ path: "*", Component: UserRoutes }]);
function App() {
  return (
    <>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <Toaster toastOptions={{ duration: 5000 }} />
        <CallProvider>
          <RouterProvider router={router} />
          <CallOverlays />
        </CallProvider>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
