// src/components/Terms.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const Terms = () => {
  const { t, i18n } = useTranslation();
  const [termsText, setTermsText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHero, setShowHero] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // Determine locale (en or de)
  const locale = useMemo(() => {
    const lang = i18n.language || "en";
    if (lang.toLowerCase().startsWith("de")) {
      return "de";
    }
    return "en";
  }, [i18n.language]);

  // Fetch the text file
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/terms-${locale}.txt`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load terms file");
        }
        return response.text();
      })
      .then((data) => {
        setTermsText(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [locale]);

  // Animation timers
  useEffect(() => {
    const heroTimer = setTimeout(() => setShowHero(true), 80);
    const contentTimer = setTimeout(() => setShowContent(true), 380);

    return () => {
      clearTimeout(heroTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  const renderBody = () => {
    if (loading) {
      return (
        <p className="text-center text-slate-400 italic mt-8">
          {t("termsPage.loading")}
        </p>
      );
    }

    if (error) {
      return (
        <p className="text-center text-red-500 font-semibold mt-8">
          {t("termsPage.error", { message: error })}
        </p>
      );
    }

    return (
      <pre className="font-sans text-slate-600 text-base leading-7 whitespace-pre-wrap max-h-[65vh] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        {termsText}
      </pre>
    );
  };

  return (
    // Page Container: White -> Light Blue Gradient (Same as Certificate Page)
    <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-b from-white to-[#F0F8FF] text-slate-800 overflow-x-hidden pb-16">
      {/* Header / Hero Section */}
      <div
        className={`w-full max-w-4xl mx-auto text-center pt-24 pb-12 px-6 transition-all duration-700 ease-out transform ${
          showHero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Pill */}
        <div className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider bg-sky-100 text-sky-600 mb-6 border border-sky-200/50">
          {t("termsPage.pill") || "Legal"}
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 leading-tight">
          {t("termsPage.title")}
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
          {t("termsPage.subtitle")}
        </p>
      </div>

      {/* Content Section */}
      <div
        className={`w-full flex justify-center px-4 md:px-6 pb-16 transition-all duration-1000 ease-out transform ${
          showContent
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-10 scale-95"
        }`}
      >
        <div className="relative w-full max-w-4xl z-10">
          {/* Background Glows (positioned absolutely behind the card) */}
          <div className="absolute w-[350px] h-[350px] bg-sky-200 rounded-full blur-[90px] opacity-50 -top-20 -left-20 -z-10 animate-pulse" />
          <div className="absolute w-[400px] h-[400px] bg-indigo-200 rounded-full blur-[90px] opacity-50 -bottom-20 -right-20 -z-10 animate-pulse delay-700" />

          {/* White Card Container */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 p-6 md:p-10 lg:p-12">
            {/* Meta Info (Updated / Jurisdiction) */}
            <div className="flex flex-wrap justify-between gap-4 text-xs md:text-sm font-bold uppercase tracking-widest text-slate-400 mb-8 border-b border-slate-100 pb-4">
              <span>{t("termsPage.meta.updated")}</span>
              <span>{t("termsPage.meta.jurisdiction")}</span>
            </div>

            {/* The Text Content */}
            {renderBody()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
