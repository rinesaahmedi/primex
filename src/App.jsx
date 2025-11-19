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

// Service Pages
import AIAgentsPage from "./pages/services/AIAgentsPage";
import SoftwareDeveloperPage from "./pages/services/SoftwareDeveloperPage";
import GraphicDesignerPage from "./pages/services/GraphicDesignerPage";
import AssistantAdministratorPage from "./pages/services/AssistantAdministratorPage";
import SalesBookkeepingPage from "./pages/services/SalesBookkeepingPage";
import ECommercePage from "./pages/services/ECommercePage";

// Agent Pages
import Agent1Page from "./pages/services/agents/Agent1Page";
import Agent2Page from "./pages/services/agents/Agent2Page";
import Agent3Page from "./pages/services/agents/Agent3Page";
import Agent4Page from "./pages/services/agents/Agent4Page";
import Agent5Page from "./pages/services/agents/Agent5Page";
import Agent6Page from "./pages/services/agents/Agent6Page";
import Agent7Page from "./pages/services/agents/Agent7Page";
import Agent8Page from "./pages/services/agents/Agent8Page";
import Agent9Page from "./pages/services/agents/Agent9Page";
import Agent10Page from "./pages/services/agents/Agent10Page";

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
          <Route path="/services/ai-agents/agent1" element={<Agent1Page />} />
          <Route path="/services/ai-agents/agent2" element={<Agent2Page />} />
          <Route path="/services/ai-agents/agent3" element={<Agent3Page />} />
          <Route path="/services/ai-agents/agent4" element={<Agent4Page />} />
          <Route path="/services/ai-agents/agent5" element={<Agent5Page />} />
          <Route path="/services/ai-agents/agent6" element={<Agent6Page />} />
          <Route path="/services/ai-agents/agent7" element={<Agent7Page />} />
          <Route path="/services/ai-agents/agent8" element={<Agent8Page />} />
          <Route path="/services/ai-agents/agent9" element={<Agent9Page />} />
          <Route path="/services/ai-agents/agent10" element={<Agent10Page />} />
          <Route path="/services/software-developer" element={<SoftwareDeveloperPage />} />
          <Route path="/services/graphic-designer" element={<GraphicDesignerPage />} />
          <Route path="/services/assistant-administrator" element={<AssistantAdministratorPage />} />
          <Route path="/services/sales-bookkeeping" element={<SalesBookkeepingPage />} />
          <Route path="/services/e-commerce" element={<ECommercePage />} />

          <Route path="/apply" element={<JoinUsForm />} />
          <Route path="/business" element={<BusinessInquiryForm />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
