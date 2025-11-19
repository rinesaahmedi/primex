// src/App.jsx
import "./App.css";
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import JoinUsForm from "./pages/JoinUsForm.jsx";
import BusinessInquiryForm from "./pages/BusinessInquiryForm.jsx";

function App() {
  const { i18n } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  const changeLanguage = (eOrLang) => {
    // support both event and direct string
    const lang = typeof eOrLang === "string" ? eOrLang : eOrLang?.target?.value;
    if (lang) i18n.changeLanguage(lang);
  };

  return (
    <div
      className={darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}
    >
      <Header
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        changeLanguage={changeLanguage}
      />

      <ScrollToTop />

      {/* ❗️Remove pt-24 here so the hero can sit right under the header */}
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />

          <Route path="/apply" element={<JoinUsForm />} />
          <Route path="/business" element={<BusinessInquiryForm />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
