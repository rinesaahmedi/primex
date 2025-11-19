// src/pages/AboutPage.jsx
import React from "react";
import { useTranslation } from "react-i18next";

const AboutPage = () => {
  const { t } = useTranslation();

  const expertise = t("about.expertise.items", { returnObjects: true }) || [];
  const aiFeatures = t("about.aiAgent.features", { returnObjects: true }) || [];
  const whyPrimex = t("about.whyPrimex.points", { returnObjects: true }) || [];

  return (
    <>
      {/* -------------------------------------------------------
         HERO — gradient like home but for About
      -------------------------------------------------------- */}
      <section className="pt-28 pb-20 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-900 text-white">
        <div className="container mx-auto px-6 max-w-6xl grid gap-12 lg:grid-cols-2 items-center">
          {/* LEFT: main title + intro */}
          <div>
            <span className="inline-flex items-center px-4 py-1 rounded-full border border-white/20 bg-white/5 text-[11px] tracking-[0.25em] uppercase mb-6">
              About PrimEx
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              {t("about.mainTitle")}
            </h1>

            <p className="text-base sm:text-lg text-indigo-100 max-w-xl">
              {t("about.intro")}
            </p>
          </div>

          {/* RIGHT: simple AI agent card */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/25 via-purple-500/20 to-pink-500/25 blur-2xl" />
            <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl">
              <h3 className="text-sm uppercase tracking-[0.2em] text-indigo-300 mb-3">
                AI Agent · 70 Seconds
              </h3>
              <p className="text-sm text-indigo-100 mb-4">
                {t("about.aiAgent.subtitle")}
              </p>

              <ul className="space-y-2 text-sm text-indigo-100/90">
                {aiFeatures.slice(0, 3).map((item, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------
         BODY — one continuous light page with clear structure
      -------------------------------------------------------- */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-6 max-w-5xl space-y-16 md:space-y-20">
          {/* Who we are */}
          <section className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Who We Are
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {t("about.whoWeAre.description")}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                With 40+ years of family experience and a decade of direct work
                in the DACH market, PrimEx blends human know-how with modern
                AI-driven automation to support furniture & living leaders.
              </p>
            </div>

            {/* simple soft gradient block on the right */}
            <div className="rounded-3xl bg-gradient-to-tr from-indigo-200 via-purple-200 to-pink-200 h-64 md:h-72 shadow-md" />
          </section>

          {/* Our Expertise */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Our Expertise
            </h2>
            <p className="text-gray-600 text-sm md:text-base text-center max-w-2xl mx-auto mb-8">
              We cover the full operational stack for furniture and retail —
              from classic backoffice work to AI-enabled workflows.
            </p>

            <div className="grid sm:grid-cols-2 gap-5">
              {expertise.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-gray-50 rounded-2xl border border-gray-100"
                >
                  <p className="text-gray-900 font-medium">{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* From Manual Services to AI */}
          <section className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t("about.aiEvolution.title")}
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                {t("about.aiEvolution.description")}
              </p>
            </div>

            <div>
              <ul className="space-y-3 text-gray-700 text-sm md:text-base">
                {aiFeatures.map((item, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Why PRIMEX */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              {t("about.whyPrimex.title")}
            </h2>

            <div className="grid sm:grid-cols-2 gap-5">
              {whyPrimex.map((point, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-gray-50 rounded-2xl border border-gray-100 text-center"
                >
                  <p className="font-semibold text-gray-900 text-sm md:text-base">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Vision & Mission */}
          <section className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t("about.visionMission.title")}
            </h2>

            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6 leading-relaxed">
              {t("about.visionMission.description")}
            </p>

            <p className="text-xl font-bold text-blue-600">
              {t("about.tagline")}
            </p>
          </section>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
