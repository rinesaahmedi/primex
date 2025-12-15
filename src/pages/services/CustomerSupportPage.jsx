// src/pages/services/CustomerSupportPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useScrollAnimation } from "../../utils/useScrollAnimation";
import {
  ArrowLeft,
  CheckCircle2,
  Headphones,
  Heart,
  ShieldCheck,
  Users,
  Clock,
  Globe,
} from "lucide-react";

// IMPORT YOUR IMAGE HERE
import supportHeroImage from "../../assets/Services/customer-support.png";

const CustomerSupportPage = () => {
  const { t } = useTranslation();
  const [sectionRef, isVisible] = useScrollAnimation({ threshold: 0.1 });

  // Configuration for the 4 service pillars
  const servicePillars = [
    {
      key: "inquiry",
      icon: <Headphones className="w-8 h-8 text-[#2378FF] mb-4" />,
      bg: "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100",
      dotColor: "bg-blue-400",
    },
    {
      key: "afterSales",
      icon: <Heart className="w-8 h-8 text-[#F43F5E] mb-4" />,
      bg: "bg-gradient-to-br from-rose-50 to-pink-50 border-rose-100",
      dotColor: "bg-rose-400",
    },
    {
      key: "claims",
      icon: <ShieldCheck className="w-8 h-8 text-[#F59E0B] mb-4" />,
      bg: "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100",
      dotColor: "bg-amber-400",
    },
    {
      key: "retention",
      icon: <Users className="w-8 h-8 text-[#8B5CF6] mb-4" />,
      bg: "bg-gradient-to-br from-purple-50 to-violet-50 border-purple-100",
      dotColor: "bg-purple-400",
    },
  ];

  return (
    <section className="min-h-screen bg-white pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="max-w-5xl mx-auto px-6">
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

        {/* 1. Header Section */}
        <div
          ref={sectionRef}
          className={`mb-12 ${isVisible ? "lift-up-subtle" : ""}`}
        >
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {t("customerSupport.title")}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-medium mb-8 leading-relaxed max-w-3xl">
            {t("customerSupport.subtitle")}
          </p>

          {/* Highlights Pills */}
          <div className="flex flex-wrap gap-3 mb-8">
            {t("customerSupport.highlights", { returnObjects: true })?.map(
              (highlight, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm font-medium text-slate-700"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#2378FF]" />
                  {highlight}
                </span>
              )
            )}
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border-l-4 border-[#2378FF]">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {t("customerSupport.intro.title")}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {t("customerSupport.intro.description")}
            </p>
          </div>
        </div>

        {/* 2. Featured Image Section */}
        <div
          className={`mb-20 ${isVisible ? "lift-up-subtle" : ""}`}
          style={{ animationDelay: isVisible ? "0.1s" : "0s" }}
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-100 group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

            <img
              src={supportHeroImage}
              alt={t("customerSupport.imageAlt")}
              className="w-full h-[300px] md:h-[500px] object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
            />

            {/* Floating Badge on Image */}
            <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white/50 max-w-xs hidden md:block">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase">
                    {t("customerSupport.badge.label")}
                  </p>
                  <p className="font-bold text-gray-900">
                    {t("customerSupport.badge.value")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Detailed Services Grid */}
        <div
          className={`mb-16 ${isVisible ? "lift-up-subtle" : ""}`}
          style={{ animationDelay: isVisible ? "0.2s" : "0s" }}
        >
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-8"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {t("customerSupport.deliverTitle")}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {servicePillars.map((pillar) => {
              const data = t(`customerSupport.services.${pillar.key}`, {
                returnObjects: true,
              });

              return (
                <div
                  key={pillar.key}
                  className={`${pillar.bg} rounded-2xl p-8 border hover:shadow-lg transition-all duration-300`}
                >
                  {pillar.icon}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {data.title}
                  </h3>
                  <p className="text-gray-600 mb-6 min-h-[3rem]">
                    {data.description}
                  </p>

                  {/* Inner Features List */}
                  <div className="bg-white/60 rounded-xl p-4 backdrop-blur-sm">
                    <ul className="space-y-3">
                      {Array.isArray(data.features) &&
                        data.features.map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 text-sm text-gray-700 font-medium"
                          >
                            <span
                              className={`mt-1.5 w-2 h-2 rounded-full ${pillar.dotColor} shrink-0`}
                            />
                            <span>{feature}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Why Choose Section */}
        <div
          className={`mb-16 ${isVisible ? "lift-up-subtle" : ""}`}
          style={{ animationDelay: isVisible ? "0.3s" : "0s" }}
        >
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-8"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {t("customerSupport.whyChoose.title")}
          </h2>
          <div className="bg-white rounded-2xl p-8 border-2 border-slate-200">
            <ul className="grid md:grid-cols-2 gap-x-6 gap-y-4">
              {t("customerSupport.whyChoose.items", {
                returnObjects: true,
              })?.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#2378FF] shrink-0 mt-0.5" />
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 5. CTA Section */}
        <div
          className={`${isVisible ? "lift-up-subtle" : ""}`}
          style={{ animationDelay: isVisible ? "0.4s" : "0s" }}
        >
          <div className="bg-gradient-to-br from-[#081333] via-[#1659bd] to-[#fadebc] rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
            {/* Decorative BG Icon */}
            <Globe className="absolute right-0 bottom-0 text-white/5 w-64 h-64 -mr-16 -mb-16" />

            <div className="relative z-10">
              <h3
                className="text-2xl md:text-3xl font-bold mb-4"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {t("customerSupport.cta.title")}
              </h3>
              <p className="text-white/90 mb-8 text-lg max-w-2xl">
                {t("customerSupport.cta.description")}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/business"
                  className="inline-flex items-center justify-center px-8 py-3 bg-white text-[#2378FF] font-semibold rounded-xl hover:bg-white/90 transition-all shadow-lg hover:shadow-xl"
                >
                  {t("customerSupport.cta.primary")}
                </Link>
                <Link
                  to="/#contact"
                  className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-[#2378FF] transition-all"
                >
                  {t("customerSupport.cta.secondary")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerSupportPage;
