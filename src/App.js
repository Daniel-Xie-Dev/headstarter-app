import "./App.css";
import Calender from "./components/Calender/Calender";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import SideNavigation from "./components/SideNavigation/SideNavigation";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
