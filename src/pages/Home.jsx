// src/pages/Home.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Hero from '../components/Hero.jsx'; // Import the Hero component
import About from '../components/About.jsx'; // Import the Hero component
import Services from '../components/Services.jsx'; // Import the Services component
import JoinBusinessSection from '../components/JoinBusinessSection.jsx'; // Import the JoinBusinessSection component  
import PartnerTestimonials from "../components/PartnerTestimonials.jsx";



export default function Home() {
  const { i18n } = useTranslation();

  // State for dark mode toggle
  const [darkMode, setDarkMode] = useState(false);

  // Dark mode toggle function
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Change language function
  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      {/* Header Component */}
      

      {/* Hero Section */}
      <Hero />

      <About />

      <Services />

      <JoinBusinessSection />

      <PartnerTestimonials />



    </div>
  );
}
