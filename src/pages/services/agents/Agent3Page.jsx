// src/pages/services/agents/Agent3Page.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useScrollAnimation } from "../../../utils/useScrollAnimation";
import {
  ArrowLeft,
  CheckCircle2,
  Zap,
  Clock,
  Shield,
  Database,
  TrendingUp,
  Activity,
} from "lucide-react";

// TODO: Replace with your Data Management/Excel screenshots
import agentOverviewImg from "../../../images/client2.webp";
import agentCapabilitiesImg from "../../../images/client2.webp";
import agentUseCasesImg from "../../../images/client2.webp";
import agentCtaImg from "../../../images/client2.webp";

const Agent3Page = () => {
  const { t } = useTranslation();
  const [sectionRef, isVisible] = useScrollAnimation({ threshold: 0.1 });
  const [activeVisual, setActiveVisual] = useState("overview");

  const sectionKeys = ["overview", "capabilities", "useCases", "cta"];

  useEffect(() => {
    const observers = [];

    sectionKeys.forEach((key) => {
      const el = document.getElementById(`agent3-${key}`);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveVisual(key);
          }
        },
        { root: null, threshold: 0.4 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  const visuals = {
    overview: {
      image: agentOverviewImg,
      title: t("agents.agent3.visuals.overview.title"),
      description: t("agents.agent3.visuals.overview.description"),
      label: t("agents.agent3.visuals.label"),
    },
    capabilities: {
      image: agentCapabilitiesImg,
      title: t("agents.agent3.visuals.capabilities.title"),
      description: t("agents.agent3.visuals.capabilities.description"),
      label: t("agents.agent3.visuals.label"),
    },
    useCases: {
      image: agentUseCasesImg,
      title: t("agents.agent3.visuals.useCases.title"),
      description: t("agents.agent3.visuals.useCases.description"),
      label: t("agents.agent3.visuals.label"),
    },
    cta: {
      image: agentCtaImg,
      title: t("agents.agent3.visuals.cta.title"),
      description: t("agents.agent3.visuals.cta.description"),
      label: t("agents.agent3.visuals.label"),
    },
  };

  const currentVisual = visuals[activeVisual];
  const capabilities = t("agents.agent3.capabilities.items", {
    returnObjects: true,
  });
  const useCaseCards = t("agents.agent3.useCases.cards", {
    returnObjects: true,
  });

  return (
    <section className="min-h-screen bg-white pt-28 pb-24 md:pt-36 md:pb-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          {/* LEFT COLUMN */}
          <div>
            <Link
              to="/services/ai-agents"
              className="inline-flex items-center gap-2 text-[#2378FF] hover:text-[#1f5fcc] mb-8 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">
                {t("agents.backToAgentsLink")}
              </span>
            </Link>

            {/* Overview */}
            <div
              ref={sectionRef}
              id="agent3-overview"
              className={`mb-12 ${isVisible ? "lift-up-subtle" : ""}`}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2378FF]/10 text-[#2378FF] text-sm font-semibold mb-6">
                <Zap className="w-4 h-4" />
                <span>{t("agents.agent3.badge")}</span>
              </div>
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {t("agents.agent3.title")}
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-3xl">
                {t("agents.agent3.subtitle")}
              </p>
            </div>

            {/* Metrics */}
            <div
              className={`grid md:grid-cols-3 gap-6 mb-16 ${
                isVisible ? "lift-up-subtle" : ""
              }`}
              style={{ animationDelay: isVisible ? "0.1s" : "0s" }}
            >
              <div className="bg-gradient-to-br from-[#2378FF] to-[#1f5fcc] rounded-xl p-6 text-white shadow-lg">
                <Shield className="w-8 h-8 mb-3 opacity-90" />
                <div className="text-3xl font-bold mb-1">
                  {t("agents.agent3.metrics.processingTime.value")}
                </div>
                <div className="text-sm opacity-90">
                  {t("agents.agent3.metrics.processingTime.label")}
                </div>
              </div>
              <div className="bg-gradient-to-br from-[#CDABFF] to-[#b894ff] rounded-xl p-6 text-white shadow-lg">
                <Clock className="w-8 h-8 mb-3 opacity-90" />
                <div className="text-3xl font-bold mb-1">
                  {t("agents.agent3.metrics.efficiency.value")}
                </div>
                <div className="text-sm opacity-90">
                  {t("agents.agent3.metrics.efficiency.label")}
                </div>
              </div>
              <div className="bg-gradient-to-br from-[#FADEBC] to-[#f5d4a8] rounded-xl p-6 text-gray-900 shadow-lg">
                <TrendingUp className="w-8 h-8 mb-3 opacity-80" />
                <div className="text-3xl font-bold mb-1">
                  {t("agents.agent3.metrics.accuracy.value")}
                </div>
                <div className="text-sm opacity-80">
                  {t("agents.agent3.metrics.accuracy.label")}
                </div>
              </div>
            </div>

            {/* Capabilities */}
            <div
              id="agent3-capabilities"
              className={`mb-16 ${isVisible ? "lift-up-subtle" : ""}`}
              style={{ animationDelay: isVisible ? "0.2s" : "0s" }}
            >
              <h2
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {t("agents.agent3.capabilities.title")}
              </h2>
              <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 rounded-2xl p-8 border-2 border-slate-200">
                <div className="grid md:grid-cols-2 gap-4">
                  {capabilities.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 bg-white/60 rounded-lg p-4"
                    >
                      <CheckCircle2 className="w-6 h-6 text-[#2378FF] shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Use Cases */}
            <div
              id="agent3-useCases"
              className={`mb-16 ${isVisible ? "lift-up-subtle" : ""}`}
              style={{ animationDelay: isVisible ? "0.3s" : "0s" }}
            >
              <h2
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {t("agents.agent3.useCases.title")}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {useCaseCards.map((card, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-6 border-2 border-slate-200"
                  >
                    {index === 0 ? (
                      <Database className="w-8 h-8 text-[#2378FF] mb-4" />
                    ) : (
                      <Activity className="w-8 h-8 text-[#CDABFF] mb-4" />
                    )}
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {card.title}
                    </h3>
                    <p className="text-gray-600">{card.body}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div
              id="agent3-cta"
              className={isVisible ? "lift-up-subtle" : ""}
              style={{ animationDelay: isVisible ? "0.4s" : "0s" }}
            >
              <div className="bg-gradient-to-br from-[#081333] via-[#1659bd] to-[#fadebc] rounded-2xl p-8 md:p-12 text-white">
                <h3
                  className="text-2xl md:text-3xl font-bold mb-4"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {t("agents.agent3.cta.title")}
                </h3>
                <p className="text-white/90 mb-8 text-lg">
                  {t("agents.agent3.cta.body")}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/business"
                    className="inline-flex items-center justify-center px-8 py-3 bg-white text-[#2378FF] font-semibold rounded-xl hover:bg-white/90 transition-all shadow-lg hover:shadow-xl"
                  >
                    {t("agents.agent3.cta.primary")}
                  </Link>
                  <Link
                    to="/#contact"
                    className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-[#2378FF] transition-all"
                  >
                    {t("agents.agent3.cta.secondary")}
                  </Link>
                </div>
              </div>
            </div>

            {/* Mobile Visual */}
            <div className="mt-10 md:hidden">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                  {currentVisual.label}
                </p>
                <img
                  src={currentVisual.image}
                  alt={currentVisual.title}
                  className="w-full rounded-2xl mb-4"
                />
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  {currentVisual.title}
                </h3>
                <p className="text-sm text-slate-600">
                  {currentVisual.description}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (Sticky) */}
          <div className="hidden md:block">
            <div className="sticky top-28">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-md">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">
                  {currentVisual.label}
                </p>
                <img
                  src={currentVisual.image}
                  alt={currentVisual.title}
                  className="w-full rounded-2xl mb-4"
                />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {currentVisual.title}
                </h3>
                <p className="text-sm text-slate-600">
                  {currentVisual.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Agent3Page;
