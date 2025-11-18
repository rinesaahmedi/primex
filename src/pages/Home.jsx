// src/pages/Home.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Header from '../components/Header.jsx'; // Import the Header component
import Hero from '../components/Hero.jsx'; // Import the Hero component
import About from '../components/About.jsx'; // Import the Hero component


export default function Home() {
  const { t, i18n } = useTranslation();

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
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} changeLanguage={changeLanguage} />
      
      {/* Hero Section */}
      <Hero darkMode={darkMode} />

      <About/>

      {/* Content Below Hero */}
      <div className="px-6 py-12">
        {/* This section was removed per your request (Counter and list) */}
        <div className="mt-5">
          <img
            src={darkMode ? "/dark-mode-image.png" : "/light-mode-image.png"}
            alt="Mode Image"
            className="w-48 h-auto mx-auto"
          />
        </div>
      </div>
    </div>
  );
}
