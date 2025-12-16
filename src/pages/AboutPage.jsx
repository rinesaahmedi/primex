// src/pages/AboutPage.jsx
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import pxBranding from "../images/40.jpg";
import AOS from "aos";
import "aos/dist/aos.css";

const AboutPage = () => {
  const { t } = useTranslation();

  // Data retrieval
  const expertise = t("about.expertise.items", { returnObjects: true }) || [];
  const aiFeatures = t("about.aiAgent.features", { returnObjects: true }) || [];
  const whyPrimex = t("about.whyPrimex.points", { returnObjects: true }) || [];

  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 50 });
  }, []);

  return (
    <div className="bg-gray-50 overflow-x-hidden font-sans text-gray-800">
      {/* -------------------------------------------------------
         HERO SECTION: Impact & Branding
         UPDATES: Added min-h-[85vh], flex items-center, and increased padding
      -------------------------------------------------------- */}
      <section className="relative min-h-[65vh] flex items-center pt-40 pb-24 lg:pt-42 lg:pb-36 bg-[#0B1120] text-white">
        {/* Background Gradients - Made slightly larger for the bigger space */}
        <div className="absolute top-0 right-0 w-[700px] h-[600px] bg-[#2378FF]/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#CDABFF]/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 max-w-7xl relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div data-aos="fade-right">
            <span className="inline-block py-1 px-3 rounded-full bg-[#2378FF]/20 border border-[#2378FF]/50 text-[#60A5FA] text-xs font-bold tracking-widest uppercase mb-8">
              {t("about.pill")}
            </span>
            <h1
              className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-8"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {t("about.mainTitle")}
            </h1>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-lg">
              {t("about.storySubtitle")}
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="pl-4 border-l-4 border-[#2378FF]">
                <p className="text-white font-semibold text-lg">
                  {t("about.tagline")}
                </p>
              </div>
            </div>
          </div>

          {/* Image Composition */}
          {/* UPDATE: Added lg:scale-110 to increase image size by 10% on large screens */}
          <div className="relative lg:scale-110" data-aos="zoom-in" data-aos-delay="200">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
              <img
                src={pxBranding}
                alt={t("about.imageAlt")}
                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent opacity-60" />
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------
         SECTION 2: Who We Are (The Narrative)
      -------------------------------------------------------- */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <div data-aos="fade-up">
            <h2
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {t("about.whoWeAre.title")}
            </h2>
            <p className="text-xl text-[#2378FF] font-medium mb-6">
              {t("about.whoWeAre.description")}
            </p>
            <p className="text-gray-600 leading-relaxed text-lg mx-auto max-w-2xl">
              {t("about.whoWeAre.additional")}
            </p>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------
         SECTION 3: Expertise (Grid Layout)
      -------------------------------------------------------- */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {t("about.expertise.title")}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("about.expertise.description")}
            </p>
          </div>

          {/* Expertise Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expertise.map((item, idx) => (
              <div
                key={idx}
                data-aos="fade-up"
                data-aos-delay={idx * 50}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#2378FF]/30 transition-all duration-300 flex items-start gap-4"
              >
                {/* Custom Check Icon */}
                <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#2378FF]">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-gray-800 font-medium">
                  {item.replace(/•\s*/g, "")} {/* Cleaning bullet points if in JSON */}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------
         SECTION 4: AI Evolution (Dark Mode Contrast)
      -------------------------------------------------------- */}
      <section className="py-24 bg-[#0F172A] text-white relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-purple-500/20 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]" />

        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            
            {/* Left: Text */}
            <div data-aos="fade-right">
              <div className="inline-flex items-center gap-2 mb-4 text-purple-300 font-semibold tracking-wide text-sm uppercase">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                Innovation
              </div>
              <h2
                className="text-3xl md:text-5xl font-bold mb-6 leading-tight"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {t("about.aiEvolution.title")}
              </h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                {t("about.aiEvolution.description")}
              </p>
              
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {t("about.aiAgent.title")}
                </h3>
                <p className="text-sm text-gray-400">
                  Seamless integration of automated intelligence into daily workflows.
                </p>
              </div>
            </div>

            {/* Right: Feature Cards */}
            <div className="space-y-4" data-aos="fade-left">
              {aiFeatures.map((feature, idx) => (
                <div
                  key={idx}
                  className="group flex items-center gap-4 p-5 bg-[#1E293B] rounded-xl border border-gray-700 hover:border-[#2378FF] transition-all duration-300 hover:bg-[#1E293B]/80"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2378FF] to-purple-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-lg font-medium text-gray-200 group-hover:text-white">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------
         SECTION 5: Vision & Why PrimEx (Bento Grid)
      -------------------------------------------------------- */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Why Primex - Spans 2 Columns */}
            <div className="lg:col-span-2 bg-blue-50/50 rounded-3xl p-8 md:p-12 border border-blue-100" data-aos="fade-up">
              <h3
                className="text-2xl md:text-3xl font-bold text-gray-900 mb-8"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {t("about.whyPrimex.title")}
              </h3>
              
              <div className="grid sm:grid-cols-2 gap-6">
                {whyPrimex.map((point, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="mt-1 w-2 h-2 rounded-full bg-[#2378FF] flex-shrink-0" />
                    <p className="text-gray-700 font-medium text-lg leading-tight">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Vision - Spans 1 Column */}
            <div 
              className="bg-[#2378FF] text-white rounded-3xl p-8 md:p-12 flex flex-col justify-center relative overflow-hidden"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              {/* Abstract Design Element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full" />
              
              <h3 className="text-xl font-bold mb-4 uppercase tracking-wider opacity-90">
                {t("about.visionMission.title")}
              </h3>
              <p className="text-lg md:text-xl font-medium leading-relaxed">
                &ldquo;{t("about.visionMission.description")}&rdquo;
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;