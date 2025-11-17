import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import LanguageSwitcher from "./components/LanguageSwitcher";

function About() {
  return (
    <div style={{ padding: 20 }}>
      <h2>About</h2>
      <p>This is an example About page.</p>
    </div>
  );
}

function App() {
  return (
    <div>
      <nav className="app-nav" style={{ display: "flex", alignItems: "center", gap: 12, padding: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link to="/">Home</Link> | <Link to="/about">About</Link>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <LanguageSwitcher />
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

export default App;
