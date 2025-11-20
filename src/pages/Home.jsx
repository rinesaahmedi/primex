// src/pages/Home.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "../components/Header.jsx"; // Import the Header component
import Hero from "../components/Hero.jsx"; // Import the Hero component
import About from "../components/About.jsx"; // Import the Hero component
import Services from "../components/Services.jsx"; // Import the Services component
import JoinBusinessSection from "../components/JoinBusinessSection.jsx"; // Import the JoinBusinessSection component
import PartnerTestimonials from "../components/PartnerTestimonials.jsx";
import PartnersGrid from "../components/PartnersGrid.jsx";

export default function Home() {
  const { i18n } = useTranslation();

  // State for dark mode toggle
  const [darkMode, setDarkMode] = useState(false);

  // Dark mode toggle function
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Change language function (supports string or event payloads)
  const changeLanguage = (choice) => {
    const lang =
      typeof choice === "string" ? choice : choice?.target?.value ?? "";
    if (!lang) return;
    i18n.changeLanguage(lang);
  };

  return (
    <div
      className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
        }`}
    >
      {/* Hero Section */}
      <Hero />

      <About />

      <Services />

      <PartnersGrid />

      <JoinBusinessSection />

      <PartnerTestimonials />
    </div>
  );
}
