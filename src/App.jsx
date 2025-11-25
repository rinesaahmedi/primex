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
import AppointmentPage from "./pages/AppointmentPage.JSX";

import JoinUsForm from "./pages/JoinUsForm.jsx";
import BusinessInquiryForm from "./pages/BusinessInquiryForm.jsx";

// Service Pages
import AIAgentsPage from "./pages/services/AIAgentsPage";
import SoftwareDeveloperPage from "./pages/services/SoftwareDeveloperPage";
import GraphicDesignerPage from "./pages/services/GraphicDesignerPage";
import AssistantAdministratorPage from "./pages/services/AssistantAdministratorPage";
import SalesBookkeepingPage from "./pages/services/SalesBookkeepingPage";
import ECommercePage from "./pages/services/ECommercePage";

// Agent Pages
import AgentTemplate from "./pages/services/agents/AgentTemplate";

import Terms from "./pages/Terms.jsx";
import CertificatePage from "./pages/CertificatePage.jsx";

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

          {/* Service Pages */}
          <Route path="/services/ai-agents" element={<AIAgentsPage />} />

          <Route
            path="/services/ai-agents/:agentId"
            element={<AgentTemplate />}
          />

          <Route
            path="/services/software-developer"
            element={<SoftwareDeveloperPage />}
          />
          <Route
            path="/services/graphic-designer"
            element={<GraphicDesignerPage />}
          />
          <Route
            path="/services/assistant-administrator"
            element={<AssistantAdministratorPage />}
          />
          <Route
            path="/services/sales-bookkeeping"
            element={<SalesBookkeepingPage />}
          />
          <Route path="/services/e-commerce" element={<ECommercePage />} />

          <Route path="/apply" element={<JoinUsForm />} />
          <Route path="/business" element={<BusinessInquiryForm />} />

          <Route path="/terms" element={<Terms />} />
          <Route path="/certificate" element={<CertificatePage />} />
          <Route path="/appointments" element={<AppointmentPage />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
