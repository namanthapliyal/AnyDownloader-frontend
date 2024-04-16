import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Footer from "./components/Footer";
import Youtube from "./components/Youtube";
import Internet from "./components/Internet";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Instagram from "./components/Instagram";

function App() {
  const [mode, setMode] = useState("light");
  const toggleMode = () => {
    if (mode === "dark") {
      setMode("light");
      document.body.style.backgroundColor = "white";
    } else {
      setMode("dark");
      document.body.style.backgroundColor = "#606a73";
    }
  };

  return (
    <Router>
      <Navbar mode={mode} toggleMode={toggleMode}></Navbar>
      <Routes>
        <Route path="/" element={<Home mode={mode}></Home>}></Route>
        <Route
          path="/instagram"
          element={<Instagram mode={mode}></Instagram>}
        ></Route>
        <Route
          path="/youtube"
          element={<Youtube mode={mode}></Youtube>}
        ></Route>
        <Route
          path="/internet"
          element={<Internet mode={mode}></Internet>}
        ></Route>
      </Routes>
      <Footer mode={mode}></Footer>
    </Router>
  );
}

export default App;
