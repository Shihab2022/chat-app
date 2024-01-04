import { Route, Routes } from "react-router-dom";
import Homepage from "./components";
import ResponsiveDrawer from "./pages";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/home" element={<Homepage />}></Route>
        <Route path="/chat" element={<ResponsiveDrawer />}></Route>
      </Routes>
    </div>
  );
}

export default App;
