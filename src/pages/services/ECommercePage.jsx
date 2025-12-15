// src/pages/services/ECommercePage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useScrollAnimation } from "../../utils/useScrollAnimation";
import {
  ArrowLeft,
  Database,
  ShieldCheck,
  TrendingUp,
  Users,
  CheckCircle2,
  Rocket,
  Layers,
} from "lucide-react";

// !!! IMPORT YOUR IMAGE HERE
import ecommerceImage from "../../assets/Services/e-commerce.png";

const ECommercePage = () => {
  const { t } = useTranslation();
  const [sectionRef, isVisible] = useScrollAnimation({ threshold: 0.1 });

  const services = [
    {
      key: "dataManagement",
      icon: <Database className="w-8 h-8 text-[#2378FF] mb-4" />,
      bg: "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100",
      textColor: "text-[#2378FF]",
    },
    {
      key: "compliance",
      icon: <ShieldCheck className="w-8 h-8 text-[#CDABFF] mb-4" />,
      bg: "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100",
      textColor: "text-[#CDABFF]",
    },
    {
      key: "optimization",
      icon: <TrendingUp className="w-8 h-8 text-[#FADEBC] mb-4" />,
      bg: "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100",
      textColor: "text-[#FADEBC]",
    },
    {
      key: "empowerment",
      icon: <Users className="w-8 h-8 text-[#2378FF] mb-4" />,
      bg: "bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100",
      textColor: "text-[#2378FF]",
    },
  ];

  return (
    <section className="min-h-screen bg-white pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="max-w-6xl mx-auto px-6">
        <Link
          to="/#services"
          className="inline-flex items-center gap-2 text-[#2378FF] hover:text-[#1f5fcc] mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">
            {t("services.backTo", "Back to Services")}
          </span>
        </Link>

        {/* Header & Intro Section (Split Layout) */}
        <div
          ref={sectionRef}
          className={`mb-20 ${isVisible ? "lift-up-subtle" : ""}`}
        >
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {t("ecommerceProductData.title")}
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 font-medium mb-12 max-w-3xl">
            {t("ecommerceProductData.subtitle")}
          </p>

          {/* SIDE-BY-SIDE LAYOUT: Text Left, Image Right */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="bg-slate-50 p-8 rounded-2xl border-l-4 border-[#2378FF] h-full flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t("ecommerceProductData.intro.title")}
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {t("ecommerceProductData.intro.description")}
              </p>
              <div className="mt-6 flex items-center gap-2 text-[#2378FF] font-semibold">
                <Layers className="w-5 h-5" />
                <span>{t("ecommerceProductData.aiTag")}</span>
              </div>
            </div>

            {/* Right: The Image */}
            <div className="relative group">
              {/* Decorative offset background */}
              <div className="absolute top-4 right-4 w-full h-full bg-[#2378FF]/10 rounded-2xl -z-10 transition-transform group-hover:translate-x-2 group-hover:translate-y-2"></div>

              <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-100 bg-white">
                <img
                  src={ecommerceImage}
                  alt={t("ecommerceProductData.title")}
                  className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Services Grid */}
        <div
          className={`mb-16 ${isVisible ? "lift-up-subtle" : ""}`}
          style={{ animationDelay: isVisible ? "0.1s" : "0s" }}
        >
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-8"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {t("ecommerceProductData.solutionsTitle")}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service) => {
              const features = t(
                `ecommerceProductData.sections.${service.key}.features`,
                { returnObjects: true }
              );

              return (
                <div
                  key={service.key}
                  className={`${service.bg} rounded-2xl p-8 border hover:shadow-lg transition-shadow duration-300`}
                >
                  {service.icon}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {t(`ecommerceProductData.sections.${service.key}.title`)}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {t(
                      `ecommerceProductData.sections.${service.key}.description`
                    )}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-3 bg-white/50 p-4 rounded-xl">
                    {Object.values(features || {}).map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-sm text-gray-700 font-medium"
                      >
                        <CheckCircle2
                          className={`w-5 h-5 ${service.textColor} shrink-0`}
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Why Choose PrimEx Section */}
        <div
          className={`mb-16 ${isVisible ? "lift-up-subtle" : ""}`}
          style={{ animationDelay: isVisible ? "0.2s" : "0s" }}
        >
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-8"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {t("ecommerceProductData.whyChoose.title")}
          </h2>
          <div className="bg-white rounded-2xl p-8 border-2 border-slate-200">
            <div className="grid md:grid-cols-2 gap-8">
              {t("ecommerceProductData.whyChoose.items", {
                returnObjects: true,
              })?.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-xl shrink-0">
                    <Rocket className="w-6 h-6 text-[#2378FF]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1">
                      {item.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div
          className={`${isVisible ? "lift-up-subtle" : ""}`}
          style={{ animationDelay: isVisible ? "0.3s" : "0s" }}
        >
          <div className="bg-gradient-to-br from-[#081333] via-[#1659bd] to-[#fadebc] rounded-2xl p-8 md:p-12 text-white">
            <h3
              className="text-2xl md:text-3xl font-bold mb-4"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {t("ecommerceProductData.cta.title")}
            </h3>
            <p className="text-white/90 mb-8 text-lg">
              {t("ecommerceProductData.cta.subtitle")}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/business"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-[#2378FF] font-semibold rounded-xl hover:bg-white/90 transition-all shadow-lg hover:shadow-xl"
              >
                {t("ecommerceProductData.cta.btnPrimary")}
              </Link>
              <Link
                to="/#contact"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-[#2378FF] transition-all"
              >
                {t("ecommerceProductData.cta.btnContact")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ECommercePage;
