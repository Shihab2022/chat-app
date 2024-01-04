import {
  Route,
  RouterProvider,
  Routes,
  createBrowserRouter,
} from "react-router-dom";
import Homepage from "./components";

function App() {
  // const router = createBrowserRouter([{ path: "*", Component: UserRoutes }]);
  return (
    <div className="App">
      <Routes>
        <Route path="/home" element={<Homepage />}></Route>
      </Routes>
    </div>
  );
}

export default App;
