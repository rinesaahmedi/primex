// src/components/Services.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";

// Example image – change the import/path if needed
import exampleServiceImage from "../images/client2.webp";

export default function Services() {
  const { t } = useTranslation();
  const services = t("services.items", { returnObjects: true }) || [];

  return (
    <section id="services" className="w-full py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            {t("services.mainTitle")}
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            {t("services.intro")}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <button
              key={index}
              type="button"
              className="group relative flex flex-col text-left overflow-hidden
                         rounded-3xl bg-white border border-slate-200 shadow-sm
                         hover:-translate-y-1 hover:shadow-xl hover:border-slate-300
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
                         transition-all duration-300"
              onClick={() => {
                // TODO: navigate, open modal, etc.
              }}
            >
              {/* Top visual / image */}
              <div className="relative h-50 bg-slate-100">
                {index === 0 ? (
                  <img
                    src={exampleServiceImage}
                    alt={service.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100 via-blue-50 to-sky-100" />
                )}
              </div>

              {/* Text content */}
              <div className="flex-1 px-5 py-4 md:px-6 md:py-5">
                <h3 className="text-2xl font-semibold text-slate-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed line-clamp-5">
                  {service.description}
                </p>

                {/* “View more” / “Mehr erfahren” CTA */}
                <div
                  className="mt-6 flex items-center text-indigo-600 font-semibold
                             opacity-0 translate-y-2
                             group-hover:opacity-100 group-hover:translate-y-0
                             group-focus-visible:opacity-100 group-focus-visible:translate-y-0
                             transition-all duration-200"
                >
                  <span className="text-sm md:text-base">
                    {t("services.ctaLabel")}
                  </span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
