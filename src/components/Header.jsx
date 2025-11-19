import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import primexLogo from "../assets/primex-logo.png";
import primexLogoWhite from "../assets/primex-logo-white.png";

// Icons (Inline SVGs to avoid installing external libraries like react-icons)
const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
  </svg>
);
const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);
const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const GlobeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const Header = ({ darkMode, toggleDarkMode, changeLanguage }) => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langMenuRef = useRef(null);

  // Detect Scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close Language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle Language Selection
  // inside Header
  const handleLanguageSelect = (lang) => {
    changeLanguage(lang); // now send just "en" or "de"
    setIsLangOpen(false);
  };

  const navLinks = [
    { href: "#about", label: t("aboutUs") },
    { href: "#services", label: t("Services") },
    { href: "#partners", label: t("ourPartners") },
    { href: "#contact", label: t("contactUs") },
  ];

  const overlayMode = !isScrolled && !isMobileMenuOpen && !darkMode;

  const headerBgClass =
    isScrolled || isMobileMenuOpen
      ? darkMode
        ? "bg-black shadow-lg"
        : "bg-white shadow-md"
      : "bg-transparent";

  const textColorClass = darkMode || overlayMode ? "text-white" : "text-black";
  const logoSrc = darkMode || overlayMode ? primexLogoWhite : primexLogo;
  const borderColorClass =
    darkMode || overlayMode ? "border-white/30" : "border-gray-200";
  const dropdownBgClass = darkMode || overlayMode ? "bg-gray-900" : "bg-white";

  return (
    <header
      className={`w-full py-4 fixed top-0 left-0 right-0 transition-all duration-300 ${textColorClass} ${headerBgClass}`}
      style={{ zIndex: 1000 }}
    >
      <div className="container mx-auto flex justify-between items-center px-12">
        {/* --- Left: Logo --- */}
        <div className="text-3xl font-bold z-50">
          <a href="/">
            <img src={logoSrc} alt="Primex Logo" className="h-8" />
          </a>
        </div>

        {/* --- Desktop Navigation --- */}
        <div className="hidden md:flex space-x-6 items-center">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-blue-600 font-medium transition-colors"
            >
              {link.label}
            </a>
          ))}

          {/* Custom Language Switcher */}
          <div className="relative" ref={langMenuRef}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-full border ${borderColorClass} hover:border-blue-500 transition-colors`}
            >
              <GlobeIcon />
              <span className="uppercase text-sm font-semibold">
                {i18n.language || "EN"}
              </span>
            </button>

            {/* Dropdown */}
            {isLangOpen && (
              <div
                className={`absolute top-full right-0 mt-2 w-24 rounded-lg shadow-xl overflow-hidden border ${borderColorClass} ${dropdownBgClass}`}
              >
                <button
                  onClick={() => handleLanguageSelect("en")}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-500 hover:text-white transition-colors ${
                    darkMode ? "hover:bg-blue-600" : "hover:bg-blue-50"
                  }`}
                >
                  {t("english")}
                </button>
                <button
                  onClick={() => handleLanguageSelect("de")}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-500 hover:text-white transition-colors ${
                    darkMode ? "hover:bg-blue-600" : "hover:bg-blue-50"
                  }`}
                >
                  {t("german")}
                </button>
              </div>
            )}
          </div>

          {/* Dark Mode Toggle (Icon) */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full transition-colors ${
              darkMode
                ? "bg-gray-800 hover:bg-gray-700 text-yellow-300"
                : "bg-gray-100 hover:bg-gray-200 text-gray-600"
            }`}
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>

        {/* --- Mobile Menu Toggle Button --- */}
        <button
          className="md:hidden z-50 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* --- Mobile Navigation Menu --- */}
      <div
        className={`fixed inset-0 bg-opacity-95 backdrop-blur-sm transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } ${darkMode ? "bg-black" : "bg-white"}`}
        style={{
          top: "64px" /* Adjust based on header height */,
          height: "calc(100vh - 64px)",
        }}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8 pb-20">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-semibold hover:text-blue-600"
            >
              {link.label}
            </a>
          ))}

          {/* Mobile Language & Theme Controls */}
          <div className="flex items-center space-x-6 mt-8">
            {/* Language */}
            <div className="flex border rounded-lg overflow-hidden">
              <button
                onClick={() => handleLanguageSelect("en")}
                className={`px-4 py-2 ${
                  i18n.language === "en" ? "bg-blue-600 text-white" : ""
                }`}
              >
                EN
              </button>
              <button
                onClick={() => handleLanguageSelect("de")}
                className={`px-4 py-2 ${
                  i18n.language === "de" ? "bg-blue-600 text-white" : ""
                }`}
              >
                DE
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-3 rounded-full ${
                darkMode
                  ? "bg-gray-800 text-yellow-300"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {darkMode ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
