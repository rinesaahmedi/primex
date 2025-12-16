import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useScrollAnimation } from "../../utils/useScrollAnimation";
import {
  ArrowLeft,
  CheckCircle2,
  Clapperboard,
  Palette,
  PenTool,
  Box,
  Sparkles,
  Layers,
  MonitorPlay,
  MousePointer2,
} from "lucide-react";

// Make sure this path is correct based on your folder structure
import graphicImage from "../../assets/Services/graphic-design-3D-visualization.png";

// Maps JSON keys (render, cad, kitchen) to Lucide Icons
const iconMap = {
  render: Clapperboard,
  cad: PenTool,
  kitchen: Box,
};

const GraphicDesignerPage = () => {
  const { t } = useTranslation();
  const [sectionRef, isVisible] = useScrollAnimation({ threshold: 0.1 });

  // Fetch the nested object safely
  const serviceData = useMemo(
    () =>
      t("serviceDetails.graphicDesigner", {
        returnObjects: true,
      }) || {},
    [t]
  );

  // Destructure with fallbacks to prevent errors if JSON is missing
  const hero = serviceData.hero || {};
  const pillars = serviceData.pillars || [];
  const sections = serviceData.sections || {};
  const benefits = serviceData.benefits || [];
  const cta = serviceData.cta || {};

  // Pillar aesthetic configuration
  const pillarColors = [
    { from: "from-blue-50", to: "to-indigo-50", icon: "text-[#2378FF]" },
    { from: "from-purple-50", to: "to-pink-50", icon: "text-[#CDABFF]" },
    { from: "from-amber-50", to: "to-orange-50", icon: "text-[#FADEBC]" },
  ];

  return (
    <section className="min-h-screen bg-white pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Navigation */}
        <Link
          to="/#services"
          className="inline-flex items-center gap-2 text-[#2378FF] hover:text-[#1f5fcc] mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">
            {t("services.backTo", "Back to Services")}
          </span>
        </Link>

        {/* --- CREATIVE HERO SECTION --- */}
        <div
          ref={sectionRef}
          className={`mb-24 grid lg:grid-cols-2 gap-12 items-center ${
            isVisible ? "lift-up-subtle" : ""
          }`}
        >
          {/* Left Column: Text */}
          <div className="relative z-10">
            {hero.eyebrow && (
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-4 h-4 text-[#CDABFF]" />
                <p className="text-xs uppercase tracking-[0.4em] text-[#2378FF] font-bold">
                  {hero.eyebrow}
                </p>
              </div>
            )}

            {hero.title && (
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {hero.title}
              </h1>
            )}

            {hero.subtitle && (
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed whitespace-pre-line border-l-4 border-purple-200 pl-6 mb-8">
                {hero.subtitle}
              </p>
            )}

            {Array.isArray(hero.highlights) && hero.highlights.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {hero.highlights.map((highlight, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-100 text-sm font-medium text-slate-700 bg-purple-50/50 backdrop-blur-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                    {highlight}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Creative Visual Showcase */}
          <div className="relative group perspective-1000">
            {/* 1. Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(#e5e7eb_1px,transparent_1px),linear-gradient(90deg,#e5e7eb_1px,transparent_1px)] bg-[size:20px_20px] rounded-3xl -z-10 transform rotate-3 scale-110 opacity-50"></div>

            {/* 2. Abstract Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-100 via-purple-100 to-pink-100 rounded-full blur-3xl opacity-60 -z-10"></div>

            {/* 3. The Main Image */}
            <div className="relative bg-white rounded-2xl p-2 shadow-2xl border border-slate-100 transform transition-transform duration-700 group-hover:rotate-1 group-hover:scale-[1.01]">
              <div className="rounded-xl overflow-hidden relative">
                <img
                  src={graphicImage}
                  alt="Graphic Design & 3D Visualization Portfolio"
                  className="w-full h-auto object-cover"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* 4. Floating 'UI Elements' */}
              <div className="absolute -top-6 -right-6 bg-white p-3 rounded-xl shadow-lg border border-slate-100 flex items-center gap-3 animate-float-slow hidden md:flex">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <MonitorPlay className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    RENDER
                  </p>
                  <p className="text-sm font-bold text-gray-800">4K Ready</p>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-4 bg-white p-3 rounded-xl shadow-lg border border-slate-100 flex items-center gap-3 animate-float-delayed hidden md:flex">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Layers className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    LAYERS
                  </p>
                  <p className="text-sm font-bold text-gray-800">Organized</p>
                </div>
              </div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg">
                <MousePointer2 className="w-12 h-12 fill-white/20" />
              </div>
            </div>
          </div>
        </div>

        {/* --- PILLARS SECTION --- */}
        <div
          className={`mb-16 ${isVisible ? "lift-up-subtle" : ""}`}
          style={{ animationDelay: isVisible ? "0.1s" : "0s" }}
        >
          {sections.offeringsTitle && (
            <h2
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-3"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {sections.offeringsTitle}
            </h2>
          )}
          {sections.offeringsSubtitle && (
            <p className="text-gray-500 mb-8 max-w-2xl">
              {sections.offeringsSubtitle}
            </p>
          )}

          <div className="grid md:grid-cols-3 gap-6">
            {pillars.map((pillar, index) => {
              const Icon = iconMap[pillar.icon] || Palette;
              const colors = pillarColors[index % pillarColors.length];
              return (
                <div
                  key={index}
                  className={`group bg-gradient-to-br ${colors.from} ${colors.to} rounded-2xl p-8 border border-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center mb-6 shadow-sm`}
                  >
                    <Icon className={`w-6 h-6 ${colors.icon}`} />
                  </div>

                  {pillar.title && (
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#2378FF] transition-colors">
                      {pillar.title}
                    </h3>
                  )}
                  {pillar.body && (
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {pillar.body}
                    </p>
                  )}
                  {pillar.items && pillar.items.length > 0 && (
                    <div className="pt-4 border-t border-white/50">
                      <ul className="space-y-2 text-sm text-gray-600">
                        {pillar.items.map((item, idx) => (
                          <li key={idx} className="flex gap-2 items-start">
                            <span className="text-purple-400 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* --- BENEFITS SECTION --- */}
        <div
          className={`mb-16 ${isVisible ? "lift-up-subtle" : ""}`}
          style={{ animationDelay: isVisible ? "0.2s" : "0s" }}
        >
          {sections.benefitsTitle && (
            <h2
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-8"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {sections.benefitsTitle}
            </h2>
          )}
          <div className="bg-white rounded-2xl p-8 border-2 border-slate-200">
            <ul className="grid md:grid-cols-2 gap-x-8 gap-y-4">
              {benefits.map((benefit, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#2378FF] shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* --- CTA SECTION --- */}
        <div
          className={`${isVisible ? "lift-up-subtle" : ""}`}
          style={{ animationDelay: isVisible ? "0.3s" : "0s" }}
        >
          <div className="bg-gradient-to-br from-[#081333] via-[#1659bd] to-[#fadebc] rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
            {/* Background Art */}
            <div className="absolute right-0 bottom-0 opacity-10">
              <PenTool className="w-64 h-64 -mr-10 -mb-10 text-white" />
            </div>

            <div className="relative z-10">
              {cta.title && (
                <h3
                  className="text-2xl md:text-3xl font-bold mb-4"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {cta.title}
                </h3>
              )}
              {cta.body && (
                <p className="text-white/90 mb-8 text-lg max-w-2xl">
                  {cta.body}
                </p>
              )}

              <div className="flex flex-wrap gap-4">
                {cta.primary && (
                  <Link
                    to="/business"
                    className="inline-flex items-center justify-center px-8 py-3 bg-white text-[#2378FF] font-semibold rounded-xl hover:bg-white/90 transition-all shadow-lg hover:shadow-xl"
                  >
                    {cta.primary}
                  </Link>
                )}
              
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GraphicDesignerPage;
