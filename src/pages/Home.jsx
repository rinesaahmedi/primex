// src/pages/Home.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "../components/Header.jsx";
import Hero from "../components/Hero.jsx";
import About from "../components/About.jsx";
import Services from "../components/Services.jsx";
import JoinBusinessSection from "../components/JoinBusinessSection.jsx";
import PartnerTestimonials from "../components/PartnerTestimonials.jsx";
import Footer from "../components/Footer.jsx";
import JoinUsForm from "./JoinUsForm.jsx";
import BusinessInquiryForm from "./BusinessInquiryForm.jsx";


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
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      {/* Header Component */}
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} changeLanguage={changeLanguage} />

      {/* Hero Section */}
      <Hero />

      <About />

      <Services />

      <JoinBusinessSection />

      <PartnerTestimonials />

      <JoinUsForm />

      <BusinessInquiryForm />

      <Footer />


    </div>
  );
}
