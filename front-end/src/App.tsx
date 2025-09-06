import { Toaster } from "react-hot-toast";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import UserRoutes from "./routes/index";
import { NAV_BAR_HEIGHT } from "./constants/common";
const router = createBrowserRouter([{ path: "*", Component: UserRoutes }]);
function App() {
  return (
    <>
      {/* <Routes>
        <Route path="/" element={<LandingPage />}></Route>
        <Route
          path="/home"
          element={<Homepage onClick={undefined} user={undefined} />}
        ></Route>
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatContainer />
            </ProtectedRoute>
          }
        ></Route>
        <Route path="/signUp" element={<SignUp />}></Route>
        <Route path="/login" element={<SignIn />}></Route>
        <Route path="/forgetPassword" element={<ForgetPassword />}></Route>
        <Route
          path="/inviteUser"
          element={
            <ProtectedRoute>
              <InviteUser />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile user={{}} />
            </ProtectedRoute>
          }
        ></Route>
      </Routes> */}
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
