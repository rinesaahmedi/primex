// src/pages/services/agents/Agent2Page.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useScrollAnimation } from "../../../utils/useScrollAnimation";
import { ArrowLeft, CheckCircle2, Zap, Database } from "lucide-react";

import agentOverviewImg from "../../../images/client2.webp";
import agentCapabilitiesImg from "../../../images/client2.webp";
import agentUseCasesImg from "../../../images/client2.webp";
import agentCtaImg from "../../../images/client2.webp";

const Agent2Page = () => {
  const { t } = useTranslation();
  const [sectionRef, isVisible] = useScrollAnimation({ threshold: 0.1 });
  const [activeVisual, setActiveVisual] = useState("overview");

  const sectionKeys = [
    "overview",
    "capabilities",
    "fivePoint",
    "useCases",
    "cta",
  ];

  useEffect(() => {
    const observers = [];

    sectionKeys.forEach((key) => {
      const el = document.getElementById(`agent2-${key}`);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveVisual(key);
        },
        { root: null, threshold: 0.4 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const visuals = {
    overview: {
      image: agentOverviewImg,
      title: t("agents.agent2.visuals.overview.title"),
      description: t("agents.agent2.visuals.overview.description"),
      label: t("agents.agent2.visuals.label"),
    },
    capabilities: {
      image: agentCapabilitiesImg,
      title: t("agents.agent2.visuals.capabilities.title"),
      description: t("agents.agent2.visuals.capabilities.description"),
      label: t("agents.agent2.visuals.label"),
    },
    fivePoint: {
      image: agentUseCasesImg,
      title: t("agents.agent2.fivePoint.title"),
      description: t("agents.agent2.visuals.useCases.description"),
      label: t("agents.agent2.visuals.label"),
    },
    useCases: {
      image: agentUseCasesImg,
      title: t("agents.agent2.visuals.useCases.title"),
      description: t("agents.agent2.visuals.useCases.description"),
      label: t("agents.agent2.visuals.label"),
    },
    cta: {
      image: agentCtaImg,
      title: t("agents.agent2.visuals.cta.title"),
      description: t("agents.agent2.visuals.cta.description"),
      label: t("agents.agent2.visuals.label"),
    },
  };

  const currentVisual = visuals[activeVisual];

  const capabilities = t("agents.agent2.capabilities.items", {
    returnObjects: true,
  });
  const fivePoints = t("agents.agent2.fivePointExample.points", {
    returnObjects: true,
  });
  const useCaseCards = t("agents.agent2.useCases.cards", {
    returnObjects: true,
  });
  const learningItems = t("agents.agent2.learning.items", {
    returnObjects: true,
  });

  return (
    <section className="min-h-screen bg-white pt-28 pb-24 md:pt-36 md:pb-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
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

            <div
              id="agent2-overview"
              ref={sectionRef}
              className={`mb-10 ${isVisible ? "lift-up-subtle" : ""}`}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2378FF]/10 text-[#2378FF] text-sm font-semibold mb-4">
                <Zap className="w-4 h-4" />
                <span>{t("agents.agent2.badge")}</span>
              </div>
              <h1
                className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {t("agents.agent2.title")}
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mb-6">
                {t("agents.agent2.subtitle")}
              </p>
            </div>

            <div
              id="agent2-capabilities"
              className={`mb-12 ${isVisible ? "lift-up-subtle" : ""}`}
            >
              <h2
                className="text-3xl font-bold text-gray-900 mb-6"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {t("agents.agent2.capabilities.title")}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {capabilities.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 bg-white rounded-lg p-4 border"
                  >
                    <CheckCircle2 className="w-6 h-6 text-[#2378FF] shrink-0 mt-0.5" />
                    <span className="text-gray-700">{c}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              id="agent2-fivePoint"
              className={`mb-12 ${isVisible ? "lift-up-subtle" : ""}`}
            >
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                {t("agents.agent2.fivePointExample.title")}
              </h3>
              <div className="bg-slate-50 p-6 rounded-xl border">
                <ul className="space-y-3">
                  {fivePoints.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#2378FF] text-white font-semibold">
                        {idx + 1}
                      </span>
                      <span className="text-gray-700">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div
              id="agent2-learning"
              className={`mb-12 ${isVisible ? "lift-up-subtle" : ""}`}
            >
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                {t("agents.agent2.learning.title")}
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {learningItems.map((li, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-br from-[#CDABFF] to-[#b894ff] rounded-xl p-6 text-white"
                  >
                    <div className="text-sm opacity-90 mb-2">{li}</div>
                  </div>
                ))}
              </div>
            </div>

            <div
              id="agent2-useCases"
              className={`mb-12 ${isVisible ? "lift-up-subtle" : ""}`}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {t("agents.agent2.useCases.title")}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {useCaseCards.map((card, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 border">
                    <Database className="w-8 h-8 text-[#2378FF] mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {card.title}
                    </h3>
                    <p className="text-gray-600">{card.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div id="agent2-cta" className={isVisible ? "lift-up-subtle" : ""}>
              <div className="bg-gradient-to-br from-[#081333] via-[#1659bd] to-[#fadebc] rounded-2xl p-8 md:p-12 text-white">
                <h3
                  className="text-2xl md:text-3xl font-bold mb-4"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {t("agents.agent2.cta.title")}
                </h3>
                <p className="text-white/90 mb-8 text-lg">
                  {t("agents.agent2.cta.body")}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/business"
                    className="inline-flex items-center justify-center px-8 py-3 bg-white text-[#2378FF] font-semibold rounded-xl hover:bg-white/90 transition-all shadow-lg hover:shadow-xl"
                  >
                    {t("agents.agent2.cta.primary")}
                  </Link>
                  <Link
                    to="/#contact"
                    className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-[#2378FF] transition-all"
                  >
                    {t("agents.agent2.cta.secondary")}
                  </Link>
                </div>
              </div>
            </div>

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

export default Agent2Page;
