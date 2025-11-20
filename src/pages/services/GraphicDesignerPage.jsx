// src/pages/services/GraphicDesignerPage.jsx
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
} from "lucide-react";

const iconMap = {
  render: Clapperboard,
  cad: PenTool,
  kitchen: Box,
};

const GraphicDesignerPage = () => {
  const { t } = useTranslation();
  const [sectionRef, isVisible] = useScrollAnimation({ threshold: 0.1 });

  const serviceData = useMemo(
    () =>
      t("serviceDetails.graphicDesigner", {
        returnObjects: true,
      }) || {},
    [t]
  );

  const hero = serviceData.hero || {};
  const pillars = serviceData.pillars || [];
  const sections = serviceData.sections || {};
  const benefits = serviceData.benefits || [];
  const cta = serviceData.cta || {};

  const pillarColors = [
    { from: "from-blue-50", to: "to-indigo-50", icon: "text-[#2378FF]" },
    { from: "from-purple-50", to: "to-pink-50", icon: "text-[#CDABFF]" },
    { from: "from-amber-50", to: "to-orange-50", icon: "text-[#FADEBC]" },
  ];

  return (
    <section className="min-h-screen bg-white pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="max-w-5xl mx-auto px-6">
        <Link
          to="/#services"
          className="inline-flex items-center gap-2 text-[#2378FF] hover:text-[#1f5fcc] mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">{t("services.backTo", "Back to Services")}</span>
        </Link>

        <div
          ref={sectionRef}
          className={`mb-12 ${isVisible ? "lift-up-subtle" : ""}`}
        >
          {hero.eyebrow && (
            <p className="text-xs uppercase tracking-[0.4em] text-[#2378FF] mb-4">
              {hero.eyebrow}
            </p>
          )}
          {hero.title && (
            <h1
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {hero.title}
            </h1>
          )}
          {hero.subtitle && (
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed whitespace-pre-line">
              {hero.subtitle}
            </p>
          )}
          {Array.isArray(hero.highlights) && hero.highlights.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3">
              {hero.highlights.map((highlight, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-sm text-slate-600 bg-white"
                >
                  <Sparkles className="w-4 h-4 text-[#2378FF]" />
                  {highlight}
                </span>
              ))}
            </div>
          )}
        </div>

        <div
          className={`mb-12 ${isVisible ? "lift-up-subtle" : ""}`}
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
            <p className="text-gray-500 mb-6">{sections.offeringsSubtitle}</p>
          )}

          <div className="grid md:grid-cols-3 gap-6">
            {pillars.map((pillar, index) => {
              const Icon = iconMap[pillar.icon] || Palette;
              const colors = pillarColors[index % pillarColors.length];
              return (
                <div
                  key={index}
                  className={`bg-linear-to-br ${colors.from} ${colors.to} rounded-2xl p-6 border border-slate-100 shadow-sm`}
                >
                  <Icon className={`w-8 h-8 ${colors.icon} mb-4`} />
                  {pillar.title && (
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {pillar.title}
                    </h3>
                  )}
                  {pillar.body && (
                    <p className="text-gray-600">{pillar.body}</p>
                  )}
                  {pillar.items && pillar.items.length > 0 && (
                    <ul className="mt-4 space-y-2 text-sm text-gray-500">
                      {pillar.items.map((item, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span>•</span>
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

        <div
          className={`mb-12 ${isVisible ? "lift-up-subtle" : ""}`}
          style={{ animationDelay: isVisible ? "0.2s" : "0s" }}
        >
          {sections.benefitsTitle && (
            <h2
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {sections.benefitsTitle}
            </h2>
          )}
          <div className="bg-white rounded-2xl p-8 border-2 border-slate-200">
            <ul className="grid md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#2378FF] shrink-0 mt-0.5" />
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className={`${isVisible ? "lift-up-subtle" : ""}`}
          style={{ animationDelay: isVisible ? "0.3s" : "0s" }}
        >
          <div className="bg-linear-to-br from-[#081333] via-[#1659bd] to-[#fadebc] rounded-2xl p-8 md:p-12 text-white">
            {cta.title && (
              <h3
                className="text-2xl md:text-3xl font-bold mb-4"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {cta.title}
              </h3>
            )}
            {cta.body && (
              <p className="text-white/90 mb-8 text-lg">
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
              {cta.secondary && (
                <Link
                  to="/#contact"
                  className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-[#2378FF] transition-all"
                >
                  {cta.secondary}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GraphicDesignerPage;

