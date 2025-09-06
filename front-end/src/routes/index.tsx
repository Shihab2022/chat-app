import { Navigate, useRoutes } from "react-router-dom";
import LandingPage from "../components/homePage";
import ChatContainer from "../pages/messages";
import ProtectedRoute from "./privateRoute";
import SignUp from "../pages/login/registerPage";
import SignIn from "../pages/login/login";

export default function Router() {
  //   const { isLoaded } = useLoadScript({
  //     googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_KEY,
  //     libraries,
  //   });

  //   const dispatch = useDispatch();
  //   useEffect(() => {
  //     if (isLoaded) {
  //       dispatch({ type: SET_GOOGLE_SCRIPT_LOADING, loading: false });
  //     }
  //   }, [dispatch, isLoaded]);

  //   useEffect(() => {
  //     dispatch(fetchStoreCategories());
  //   }, []);
  return useRoutes([
    // {
    //   path: "/dashboard",
    //   children: [
    //     {
    //       path: "/dashboard",
    //       element: (
    //         <PrivateRoute>
    //           <SpaticMainLayout>
    //             <Home />
    //           </SpaticMainLayout>
    //         </PrivateRoute>
    //       ),
    //     },
    //     {
    //       path: "/dashboard/:tabName",
    //       element: (
    //         <PrivateRoute>
    //           <SpaticMainLayout>
    //             <Home />
    //           </SpaticMainLayout>
    //         </PrivateRoute>
    //       ),
    //     },
    //     {
    //       path: "/dashboard/sites",
    //       element: (
    //         <PublicRoute>
    //           <MainLayout hideSidebar hideToggle hidehelpIcon>
    //             <Sites />
    //           </MainLayout>
    //         </PublicRoute>
    //       ),
    //     },
    //     {
    //       path: "/dashboard/sites/:id",
    //       element: (
    //         <PublicRoute>
    //           <MainLayout hideSidebar hideToggle hidehelpIcon>
    //             <SiteDetails />
    //           </MainLayout>
    //         </PublicRoute>
    //       ),
    //     },
    //     {
    //       path: "/dashboard/sites/:id",
    //       element: (
    //         <PrivateRoute>
    //           <MainLayout name="Sites" hideSidebar>
    //             <SiteDetails />
    //           </MainLayout>
    //         </PrivateRoute>
    //       ),
    //     },
    //   ],
    // },
    // {
    //   path: "/site",
    //   children: [
    //     {
    //       path: "/site/recommendations",
    //       element: (
    //         <PrivateRoute>
    //           <MainLayout hideSidebar>
    //             <SiteRecommendations />
    //           </MainLayout>
    //         </PrivateRoute>
    //       ),
    //     },
    //     {
    //       path: "/site/analysis",
    //       element: (
    //         <PrivateRoute>
    //           <SpaticMainLayout headerSectionName="placeSelector">
    //             <SiteAnalysis />
    //           </SpaticMainLayout>
    //         </PrivateRoute>
    //       ),
    //     },
    //     {
    //       path: "/site/analysis/:id",
    //       element: (
    //         <PrivateRoute>
    //           <SpaticMainLayout headerSectionName="placeSelector">
    //             <SiteAnalysis />
    //           </SpaticMainLayout>
    //         </PrivateRoute>
    //       ),
    //     },
    //   ],
    // },
    {
      path: "/chat",
      children: [
        {
          path: "/chat",
          element: (
            <ProtectedRoute>
              <ChatContainer />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: "/",
      element: <LandingPage />,
      children: [
        { path: "/", element: <Navigate to="/" /> },
        { path: "/", element: <LandingPage /> },
        { path: "SignUp", element: <SignUp /> },
        { path: "login", element: <SignIn /> },
        // { path: "reset-password", element: <ResetPassword /> },
        // { path: "confirm-account", element: <ConfirmAccount /> },
        // { path: "accept-invite", element: <AcceptInvite /> },
        // { path: "404", element: <NotFound /> },
        // { path: "login/enact/user", element: <EnactUser /> },
        { path: "*", element: <Navigate to="/404" /> },
      ],
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}
