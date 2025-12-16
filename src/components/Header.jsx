import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, Link } from "react-router-dom";
import primexLogo from "../assets/primex-logo.png";
import primexLogoWhite from "../assets/primex-logo-white.png";
import CalendarIcon from "../assets/svgs/calendarIcone";

// Icons
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
const GlobeIcon = ({ className }) => (
  <svg
    className={className}
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

const Header = ({ changeLanguage }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langMenuRef = useRef(null);

  // White background pages check
  const isWhitePage =
    location.pathname.startsWith("/services") ||
    location.pathname === "/about" ||
    location.pathname === "/apply" ||
    location.pathname === "/business" ||
    location.pathname === "/certificate" ||
    location.pathname === "/appointments" ||
    location.pathname === "/terms";

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

  // Language persistence logic
  const hasInitializedLanguage = useRef(false);

  const getStoredLanguage = () => {
    if (typeof window === "undefined") return null;
    try {
      return window.localStorage?.getItem("preferredLanguage");
    } catch (error) {
      console.warn("Unable to access stored language preference:", error);
      return null;
    }
  };

  const setStoredLanguage = (lang) => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage?.setItem("preferredLanguage", lang);
    } catch (error) {
      console.warn("Unable to persist language preference:", error);
    }
  };

  useEffect(() => {
    if (hasInitializedLanguage.current || typeof window === "undefined") {
      return;
    }
    const storedLang = getStoredLanguage();
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

  const handleLanguageSelect = (lang) => {
    setStoredLanguage(lang);
    changeLanguage(lang);
    setIsLangOpen(false);
  };

  const navLinks = [
    { href: "#about", label: t("aboutUs") },
    { href: "#services", label: t("Services") },
    { href: "#partners", label: t("ourPartners") },
    { href: "#contact", label: t("contactUs") },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }, 100);
    } else {
      const element = document.querySelector(href);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
    setIsMobileMenuOpen(false);
  };

  const overlayMode = !isScrolled && !isMobileMenuOpen && !isWhitePage;
  const headerBgClass =
    isScrolled || isMobileMenuOpen || isWhitePage
      ? "bg-white shadow-md"
      : "bg-transparent";
  const textColorClass = overlayMode ? "text-white" : "text-black";
  const isWhiteLogo = overlayMode;
  const logoSrc = isWhiteLogo ? primexLogoWhite : primexLogo;
  const borderColorClass = overlayMode ? "border-white/30" : "border-gray-200";
  const dropdownBgClass = overlayMode ? "bg-gray-900" : "bg-white";

  return (
    <header
      className={`w-full py-4 fixed top-0 left-0 right-0 transition-all duration-300 ${textColorClass} ${headerBgClass}`}
      style={{ zIndex: 1000 }}
    >
      <div className="container mx-auto flex justify-between items-center px-12">
        {/* Logo */}
        <div className="text-3xl font-bold z-50">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <img
              src={logoSrc}
              alt="Primex Logo"
              className={isWhiteLogo ? "h-16" : "h-12"}
            />
          </a>
        </div>

        {/* Desktop Navigation */}
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

          {/* Desktop Language Switcher */}
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
            {isLangOpen && (
              <div
                className={`absolute top-full right-0 mt-2 w-24 rounded-lg shadow-xl overflow-hidden border ${borderColorClass} ${dropdownBgClass}`}
              >
                <button
                  onClick={() => handleLanguageSelect("en")}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  {t("english")}
                </button>
                <button
                  onClick={() => handleLanguageSelect("de")}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  {t("german")}
                </button>
              </div>
            )}
          </div>

          {/* Desktop Calendar Icon */}
          <Link to="/appointments">
            <button
              className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-200 transition-all"
              aria-label={t("goToCalendar")}
            >
              <CalendarIcon />
            </button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden z-50 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* --- Mobile Navigation Menu (Floating Card Style) --- */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 md:hidden ${
          isMobileMenuOpen
            ? "opacity-100 z-998"
            : "opacity-0 pointer-events-none z-[-1]"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className={`absolute inset-x-4 top-20 bg-white rounded-3xl shadow-2xl transition-all duration-300 md:hidden flex flex-col ${
            isMobileMenuOpen
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-4 opacity-0 scale-95"
          }`}
          onClick={(e) => e.stopPropagation()}
          style={{ maxHeight: "calc(100vh - 120px)" }}
        >
          {/* Menu Header / Close */}
          <div className="flex justify-between p-4 border-b border-gray-100">
             {/* Spacer for alignment */}
             <div></div> 
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label={t("closeMenu")}
            >
              <CloseIcon />
            </button>
          </div>

          {/* Menu Links */}
          <div className="flex-1 px-2 py-4 overflow-y-auto">
            <nav className="space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    handleNavClick(e, link.href);
                    setIsMobileMenuOpen(false);
                  }}
                  className="block px-6 py-4 text-lg font-medium text-gray-800 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* --- FIXED BOTTOM PART --- */}
          <div className="p-6 bg-gray-50 rounded-b-3xl border-t border-gray-100 mt-auto">
            <div className="flex flex-col gap-4">
              {/* 1. Appointment Button */}
              <Link
                to="/appointments"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-[#2378FF] text-white rounded-xl shadow-md hover:bg-blue-600 active:scale-[0.98] transition-all"
              >
                <div className="text-white">
                  <CalendarIcon />
                </div>
                <span className="text-lg font-bold">
                  {t("bookAppointment") || "Termin buchen"}
                </span>
              </Link>

              {/* 2. New Clean Language Switcher (Segmented Control) */}
              <div className="bg-white p-1.5 rounded-xl border border-gray-200 flex shadow-sm">
                <button
                  onClick={() => handleLanguageSelect("en")}
                  className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 ${
                    i18n.language === "en"
                      ? "bg-gray-900 text-white shadow-md"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => handleLanguageSelect("de")}
                  className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 ${
                    i18n.language === "de"
                      ? "bg-gray-900 text-white shadow-md"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  Deutsch
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