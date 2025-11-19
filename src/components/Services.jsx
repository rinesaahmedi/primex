// src/components/Services.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, Cpu, Laptop, Palette, ClipboardList, BarChart3, ShoppingBag } from "lucide-react";
import { useScrollAnimation } from "../utils/useScrollAnimation";

export default function Services() {
  const { t } = useTranslation();
  const services = t("services.items", { returnObjects: true }) || [];
  const [sectionRef, isVisible] = useScrollAnimation({ threshold: 0.1 });

  const serviceIcons = [Cpu, Laptop, Palette, ClipboardList, BarChart3, ShoppingBag];

  // Map service titles to slugs
  const serviceSlugs = [
    "ai-agents",
    "software-developer",
    "graphic-designer",
    "assistant-administrator",
    "sales-bookkeeping",
    "e-commerce",
  ];

  return (
    <section
      id="services"
      className="relative w-full py-24 overflow-hidden bg-gradient-to-br from-[#0814330d] via-[#2378ff10] to-[#fadebc33]"
    >
      <div className="absolute -top-24 -right-10 h-72 w-72 rounded-full bg-[#fadebc44] blur-3xl opacity-80 pointer-events-none" />
      <div className="absolute -bottom-32 -left-10 h-72 w-72 rounded-full bg-[#2378ff26] blur-3xl opacity-60 pointer-events-none" />

      <div ref={sectionRef} className="relative max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className={`text-center mb-14 animate-lift-blur-subtle ${isVisible ? 'visible' : ''}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-black">
            {t("services.mainTitle")}
          </h2>
          <p className="mt-4 text-base md:text-lg text-slate-600 max-w-3xl mx-auto">
            {t("services.intro")}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const IconComponent = serviceIcons[index];
            const serviceSlug = serviceSlugs[index];
            return (
              <Link
                key={index}
                to={`/services/${serviceSlug}`}
                className={`group relative flex flex-col text-left overflow-visible
                         rounded-2xl bg-white border border-slate-100 shadow-sm
                         hover:-translate-y-1 hover:shadow-lg hover:border-slate-200
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2378FF]
                         transition-all duration-300 animate-lift-blur-subtle ${isVisible ? 'visible' : ''}`}
                style={{ transitionDelay: `${0.2 + index * 0.1}s` }}
              >
                {/* Icon slot - top left, popping out */}
                {IconComponent && (
                  <div className="absolute -top-5 left-5">
                    <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[#2378FF] border border-slate-100 shadow-[0_15px_45px_rgba(8,13,35,0.15)] group-hover:shadow-[0_25px_55px_rgba(8,13,35,0.18)] transition-all duration-300">
                      <IconComponent className="h-8 w-8" strokeWidth={1.6} />
                    </span>
                  </div>
                )}

                {/* Text content */}
                <div className="flex-1 px-5 pt-12 pb-4 md:px-5 md:pt-14 md:pb-5">
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-4">
                    {service.description}
                  </p>

                  {/* CTA */}
                  <div
                    className="mt-5 flex items-center text-[#2378FF] font-semibold text-sm
                             opacity-0 translate-y-2
                             group-hover:opacity-100 group-hover:translate-y-0
                             focus-visible:opacity-100 focus-visible:translate-y-0
                             transition-all duration-200"
                  >
                    <span>{t("services.ctaLabel")}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
