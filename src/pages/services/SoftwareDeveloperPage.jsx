// src/pages/services/SoftwareDeveloperPage.jsx
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useScrollAnimation } from "../../utils/useScrollAnimation";
import {
  ArrowLeft,
  CheckCircle2,
  Code,
  Shield,
  Database,
  Zap,
  Cpu,
  Server,
} from "lucide-react";

// !!! IMPORT IMAGE HERE
import softwareImage from "../../assets/Services/software-development.png";

const iconMap = {
  hammer: Code,
  database: Database,
  cpu: Zap,
  "shield-check": Shield,
};

const SoftwareDeveloperPage = () => {
  const { t } = useTranslation();
  const [sectionRef, isVisible] = useScrollAnimation({ threshold: 0.1 });

  // Fetch data from the new root-level "softwareDeveloper" key
  const serviceData = useMemo(
    () =>
      t("softwareDeveloper", {
        returnObjects: true,
      }) || {},
    [t]
  );

  const hero = serviceData.hero || {};
  const pillars = serviceData.pillars || [];
  const sections = serviceData.sections || {};
  const benefits = serviceData.benefits || [];
  const cta = serviceData.cta || {};

  return (
    <section className="min-h-screen bg-white pt-32 pb-24 md:pt-40 md:pb-32">
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

        {/* 1. HERO SECTION */}
        <div
          ref={sectionRef}
          className={`mb-20 ${isVisible ? "lift-up-subtle" : ""}`}
        >
          {hero.eyebrow && (
            <p className="text-xs uppercase tracking-[0.4em] text-[#2378FF] mb-4">
              {hero.eyebrow}
            </p>
          )}

          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {hero.title}
          </h1>

          {/* SPLIT LAYOUT: Text Left / Image Right */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mt-8">
            {/* LEFT: Text Content */}
            <div>
              <p className="text-xl md:text-2xl text-gray-700 font-medium mb-6 border-l-4 border-[#2378FF] pl-6">
                {hero.subtitle}
              </p>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <p className="text-gray-600 leading-relaxed text-lg">
                  {hero.description}
                </p>

                {/* TRANSLATED TAGS */}
                <div className="mt-6 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 bg-white px-3 py-2 rounded-lg border border-slate-200">
                    <Cpu className="w-4 h-4 text-[#2378FF]" />
                    <span>
                      {t("softwareDeveloper.hero.tags.pods", "Custom Pods")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 bg-white px-3 py-2 rounded-lg border border-slate-200">
                    <Shield className="w-4 h-4 text-[#2378FF]" />
                    <span>
                      {t(
                        "softwareDeveloper.hero.tags.security",
                        "Cybersecurity"
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 bg-white px-3 py-2 rounded-lg border border-slate-200">
                    <Server className="w-4 h-4 text-[#2378FF]" />
                    <span>
                      {t(
                        "softwareDeveloper.hero.tags.integration",
                        "Integration"
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Image Placement */}
            <div className="relative group">
              {/* Decorative background grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#2378ff1a_1px,transparent_1px),linear-gradient(to_bottom,#2378ff1a_1px,transparent_1px)] bg-[size:32px_32px] rounded-2xl -z-10 transform translate-x-4 translate-y-4"></div>

              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-white">
                <img
                  src={softwareImage}
                  alt="PrimEx Software Development Team"
                  className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                />

                {/* TRANSLATED OVERLAY BADGE */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-lg shadow-sm border border-slate-100 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-mono font-semibold text-slate-700">
                    {t("softwareDeveloper.hero.imageBadge", "SYSTEMS ACTIVE")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. PILLARS GRID */}
        <div
          className={`mb-16 ${isVisible ? "lift-up-subtle" : ""}`}
          style={{ animationDelay: isVisible ? "0.1s" : "0s" }}
        >
          {sections.offeringsTitle && (
            <h2
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-8"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {sections.offeringsTitle}
            </h2>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {pillars.map((pillar, index) => {
              const Icon = iconMap[pillar.icon] || Code;
              // Distinct tech color palettes for cards
              const palettes = [
                {
                  bg: "from-[#e4edff] to-[#f1f5ff]",
                  color: "#2378FF",
                  border: "border-blue-100",
                },
                {
                  bg: "from-[#fce8ff] to-[#fff3ff]",
                  color: "#CDABFF",
                  border: "border-purple-100",
                },
                {
                  bg: "from-[#fff1dc] to-[#fff8ec]",
                  color: "#F2A436",
                  border: "border-orange-100",
                },
                {
                  bg: "from-[#e0efff] to-[#f2f9ff]",
                  color: "#2378FF",
                  border: "border-blue-100",
                },
              ];
              const palette = palettes[index % palettes.length];

              return (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${palette.bg} rounded-3xl p-8 border ${palette.border} shadow-sm hover:shadow-md transition-shadow group`}
                >
                  <Icon
                    className="w-8 h-8 mb-4 transition-transform group-hover:scale-110"
                    style={{ color: palette.color }}
                  />
                  {pillar.title && (
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {pillar.title}
                    </h3>
                  )}
                  {pillar.body && (
                    <p className="text-gray-600 mb-6">{pillar.body}</p>
                  )}
                  {pillar.items && pillar.items.length > 0 && (
                    <ul className="space-y-3 bg-white/60 p-4 rounded-xl backdrop-blur-sm">
                      {pillar.items.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex gap-3 items-start text-sm text-gray-700"
                        >
                          <Code className="w-4 h-4 text-[#2378FF] mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. BENEFITS SECTION */}
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
          <div className="bg-white rounded-2xl p-8 border-2 border-slate-200 shadow-sm">
            <ul className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-[#2378FF]" />
                  </div>
                  <span className="text-gray-700 leading-relaxed">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 4. CTA SECTION */}
        <div
          className={`${isVisible ? "lift-up-subtle" : ""}`}
          style={{ animationDelay: isVisible ? "0.3s" : "0s" }}
        >
          <div className="bg-gradient-to-br from-[#081333] via-[#1659bd] to-[#fadebc] rounded-2xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

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

export default SoftwareDeveloperPage;
