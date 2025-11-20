import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, Link } from "react-router-dom";
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
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langMenuRef = useRef(null);

  // Check if we're on a white background page (service pages, about, etc.)
  const isWhitePage = location.pathname.startsWith('/services') ||
    location.pathname === '/about' ||
    location.pathname === '/apply' ||
    location.pathname === '/business';

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

  const hasInitializedLanguage = useRef(false);

  // Auto-detect preferred language (runs once on mount)
  useEffect(() => {
    if (hasInitializedLanguage.current || typeof window === "undefined") {
      return;
    }

    const storedLang =
      typeof window !== "undefined"
        ? window.localStorage?.getItem("preferredLanguage")
        : null;

    if (storedLang && storedLang !== i18n.language) {
      changeLanguage(storedLang);
      hasInitializedLanguage.current = true;
      return;
    }

    const browserLangs =
      window.navigator.languages?.length > 0
        ? window.navigator.languages
        : [window.navigator.language];

    const normalized = browserLangs
      .filter(Boolean)
      .map((lang) => lang.toLowerCase());

    const germanLocales = ["de", "de-de", "de-at", "de-ch"];
    const prefersGerman = normalized.some((lang) =>
      germanLocales.includes(lang)
    );

    const preferredLanguage = prefersGerman ? "de" : "en";

    if (preferredLanguage !== i18n.language) {
      changeLanguage(preferredLanguage);
    }

    hasInitializedLanguage.current = true;
  }, [changeLanguage, i18n.language]);

  // Handle Language Selection
  // inside Header
  const handleLanguageSelect = (lang) => {
    if (typeof window !== "undefined") {
      window.localStorage?.setItem("preferredLanguage", lang);
    }
    changeLanguage(lang); // now send just "en" or "de"
    setIsLangOpen(false);
  };

  const navLinks = [
    { href: "#about", label: t("aboutUs") },
    { href: "#services", label: t("Services") },
    { href: "#partners", label: t("ourPartners") },
    { href: "#contact", label: t("contactUs") },
  ];

  // Handle smooth scroll navigation
  const handleNavClick = (e, href) => {
    e.preventDefault();

    // If we're not on the home page, navigate to home first
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation, then scroll to section
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }, 100);
    } else {
      // We're on the home page, just scroll to the section
      const element = document.querySelector(href);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
    // Close mobile menu if open
    setIsMobileMenuOpen(false);
  };

  const overlayMode = !isScrolled && !isMobileMenuOpen && !darkMode && !isWhitePage;

  const headerBgClass =
    isScrolled || isMobileMenuOpen || isWhitePage
      ? darkMode
        ? "bg-black shadow-lg"
        : "bg-white shadow-md"
      : "bg-transparent";

  const textColorClass = (darkMode || (overlayMode && !isWhitePage)) ? "text-white" : "text-black";
  const isWhiteLogo = (darkMode || (overlayMode && !isWhitePage));
  const logoSrc = isWhiteLogo ? primexLogoWhite : primexLogo;
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
          <a href="/" onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}>
            <img src={logoSrc} alt="Primex Logo" className={isWhiteLogo ? "h-16" : "h-12"} />
          </a>
        </div>

        {/* --- Desktop Navigation --- */}
        <div className="hidden md:flex space-x-6 items-center">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="hover:text-[#2378FF] font-medium transition-colors cursor-pointer"
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
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-500 hover:text-white transition-colors ${darkMode ? "hover:bg-blue-600" : "hover:bg-blue-50"
                    }`}
                >
                  {t("english")}
                </button>
                <button
                  onClick={() => handleLanguageSelect("de")}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-500 hover:text-white transition-colors ${darkMode ? "hover:bg-blue-600" : "hover:bg-blue-50"
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
            className={`p-2 rounded-full transition-colors ${darkMode
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

      {/* --- Mobile Navigation Menu (Modal Style) --- */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 md:hidden ${isMobileMenuOpen ? "opacity-100 z-[998]" : "opacity-0 pointer-events-none z-[-1]"
          }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className={`absolute inset-x-4 top-20 bg-white rounded-3xl shadow-2xl transition-all duration-300 md:hidden ${isMobileMenuOpen ? "translate-y-0 opacity-100 scale-100" : "translate-y-4 opacity-0 scale-95"
            }`}
          onClick={(e) => e.stopPropagation()}
          style={{ maxHeight: "calc(100vh - 120px)" }}
        >
          <div className="flex flex-col max-h-full">
            {/* Close Button */}
            <div className="flex justify-end p-4 border-b border-gray-200">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close menu"
              >
                <CloseIcon />
              </button>
            </div>
            {/* Navigation Links */}
            <div className="flex-1 px-6 py-6 overflow-y-auto">
              <nav className="space-y-1">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => {
                      handleNavClick(e, link.href);
                      setIsMobileMenuOpen(false);
                    }}
                    className="block px-4 py-4 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Separator */}
            <div className="border-t border-gray-200"></div>

            {/* Mobile Language & Theme Controls */}
            <div className="px-6 py-6 bg-white">
              <div className="space-y-4">
                {/* Language Switcher */}
                <button
                  onClick={() => handleLanguageSelect(i18n.language === "en" ? "de" : "en")}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-[#2378FF] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <GlobeIcon className="text-gray-600" />
                    <span className="text-base font-semibold text-gray-900">
                      {i18n.language === "en" ? "English" : "Deutsch"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded text-sm font-semibold ${i18n.language === "en"
                      ? "bg-[#2378FF] text-white"
                      : "bg-gray-100 text-gray-600"
                      }`}>
                      EN
                    </span>
                    <span className={`px-3 py-1 rounded text-sm font-semibold ${i18n.language === "de"
                      ? "bg-[#2378FF] text-white"
                      : "bg-gray-100 text-gray-600"
                      }`}>
                      DE
                    </span>
                  </div>
                </button>

                {/* Theme Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-[#2378FF] transition-colors"
                >
                  <span className="text-base font-semibold text-gray-900">
                    {darkMode ? "Light Mode" : "Dark Mode"}
                  </span>
                  <div className={`p-2 rounded-lg ${darkMode ? "bg-gray-800 text-yellow-300" : "bg-gray-100 text-gray-700"}`}>
                    {darkMode ? <SunIcon /> : <MoonIcon />}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
