import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import LanguageSwitcher from "./components/LanguageSwitcher";
import About from "./components/About.jsx";



function App() {
  return (
    <div>
    

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

export default App;
