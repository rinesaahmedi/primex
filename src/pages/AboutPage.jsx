// src/pages/AboutPage.jsx
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import pxBranding from "../images/40.jpg";
import { useScrollAnimation } from "../utils/useScrollAnimation";
import AOS from "aos";
import "aos/dist/aos.css";

// Timeline Card Component with improved animations
const TimelineCard = ({
  title,
  description,
  additionalText,
  subtitle,
  listItems,
  visionTitle,
  visionDescription,
  tagline,
  delay,
}) => {
  const [itemRef, isVisible] = useScrollAnimation({ threshold: 0.15 });

  return (
    <div ref={itemRef} className="relative pl-6 md:pl-14">
      <span className="hidden md:block absolute left-[18px] top-8 h-4 w-4 rounded-full border-2 border-[#2378FF] bg-white" />

      <div
        className={`bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 transition-all duration-500 ${
          isVisible ? "lift-up-subtle" : ""
        }`}
        style={{ animationDelay: isVisible ? `${delay}ms` : "0ms" }}
      >
        <h3
          className="text-2xl font-semibold text-[#2378FF] mb-3"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {title}
        </h3>

        {description && (
          <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4">
            {description}
          </p>
        )}

        {additionalText && (
          <p className="text-sm text-gray-600 leading-relaxed">
            {additionalText}
          </p>
        )}

        {subtitle && (
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            {subtitle}
          </h4>
        )}

        {listItems && (
          <ul className="grid sm:grid-cols-2 gap-2 text-sm text-gray-800">
            {listItems.map((item, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#2378FF]" />
                {item}
              </li>
            ))}
          </ul>
        )}

        {visionTitle && (
          <>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              {visionTitle}
            </h4>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-3">
              {visionDescription}
            </p>
          </>
        )}

        {tagline && (
          <p className="text-base md:text-lg font-semibold text-[#2378FF]">
            {tagline}
          </p>
        )}
      </div>
    </div>
  );
};

const AboutPage = () => {
  const { t } = useTranslation();

  const expertise = t("about.expertise.items", { returnObjects: true }) || [];
  const aiFeatures = t("about.aiAgent.features", { returnObjects: true }) || [];
  const whyPrimex = t("about.whyPrimex.points", { returnObjects: true }) || [];

  // Initialize AOS animations
  useEffect(() => {
    AOS.init({ duration: 900, once: true });
  }, []);

  return (
    <>
      {/* -------------------------------------------------------
         HERO — Big Image + Short Text + Colored Accents
      -------------------------------------------------------- */}
      <section className="relative pt-32 pb-28 bg-gradient-to-br from-black via-[#071333] to-[#2378FF] text-white overflow-hidden">
        {/* Background glowing elements */}
        <div className="absolute -top-40 right-[-80px] w-[420px] h-[420px] bg-[#CDABFF]/35 blur-[140px]" />
        <div className="absolute bottom-[-120px] left-[-60px] w-[380px] h-[380px] bg-[#FADEBC]/25 blur-[140px]" />

        <div className="container mx-auto px-6 max-w-6xl relative z-[5] flex flex-col items-center text-center">
          {/* IMAGE */}
          <div
            className="w-full max-w-4xl md:max-w-5xl mb-8"
            data-aos="zoom-in"
          >
            <img
              src={pxBranding}
              alt={t("about.imageAlt")}
              className="w-full h-auto rounded-[32px] shadow-2xl border border-white/10"
            />
          </div>

          {/* TAG */}
          <span
            className="inline-flex items-center px-4 py-1 rounded-full border border-white/25 bg-white/10 
            text-[11px] tracking-[0.25em] uppercase mb-3"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            {t("about.pill")}
          </span>

          {/* TITLE */}
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white/95 mb-3 max-w-2xl leading-snug"
            style={{ fontFamily: "var(--font-serif)" }}
            data-aos="fade-up"
            data-aos-delay="350"
          >
            {t("about.mainTitle")}
          </h1>

          {/* Colored underline */}
          <div
            className="w-24 h-1.5 bg-gradient-to-r from-[#2378FF] via-[#CDABFF] to-[#FADEBC] rounded-full mb-3"
            data-aos="fade-in"
            data-aos-delay="500"
          />

          {/* SHORT SUBTEXT */}
          <p
            className="text-sm md:text-base text-gray-300 max-w-md"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            {t("about.tagline")}
          </p>
        </div>
      </section>

      {/* -------------------------------------------------------
         BODY — The PrimEx Story (Timeline)
      -------------------------------------------------------- */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="inline-block" data-aos="fade-up">
              <h2
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-2"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {t("about.storyTitle")}
              </h2>
              <p className="text-sm md:text-base text-gray-600">
                {t("about.storySubtitle")}
              </p>
            </div>
          </div>

          {/* Timeline container */}
          <div className="relative">
            <span className="hidden md:block absolute left-5 top-0 bottom-0 w-px bg-indigo-100" />

            <div className="space-y-12 md:space-y-14">
              {/* ------------------- 1. WHO WE ARE ------------------- */}
              <TimelineCard
                title={t("about.whoWeAre.title")}
                description={t("about.whoWeAre.description")}
                additionalText={t("about.whoWeAre.additional")}
                delay={0}
              />

              {/* ------------------- 2. OUR EXPERTISE ------------------- */}
              <TimelineCard
                title={t("about.expertise.title")}
                description={t("about.expertise.description")}
                listItems={expertise}
                delay={100}
              />

              {/* ------------------- 3. AI TRANSFORMATION ------------------- */}
              <TimelineCard
                title={t("about.aiEvolution.title")}
                description={t("about.aiEvolution.description")}
                subtitle={t("about.aiAgent.title")}
                listItems={aiFeatures}
                delay={200}
              />

              {/* ------------------- 4. WHY PRIMEX + VISION ------------------- */}
              <TimelineCard
                title={t("about.whyPrimex.title")}
                listItems={whyPrimex}
                visionTitle={t("about.visionMission.title")}
                visionDescription={t("about.visionMission.description")}
                tagline={t("about.tagline")}
                delay={300}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
