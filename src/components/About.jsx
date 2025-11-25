// src/components/About.jsx  (HOME VERSION – gradient cards with hover effect)
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "../utils/useScrollAnimation";

const About = () => {
  const { t } = useTranslation();
  const points = t("about.whyPrimex.points", { returnObjects: true }) || [];
  const [sectionRef, isVisible] = useScrollAnimation({ threshold: 0.1 });

  const LAYOUT = "max-w-7xl mx-auto lg:px-12";

  // Light gradients for each card
  const gradientClasses = [
    "bg-gradient-to-br from-indigo-50 via-blue-50 to-slate-50",
    "bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50",
    "bg-gradient-to-br from-violet-50 via-indigo-50 to-blue-50",
    "bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50",
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div
        ref={sectionRef}
        className={`container mx-auto px-6 max-w-6xl ${LAYOUT}`}
      >
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* LEFT SIDE */}
          <div
            className={`animate-lift-blur-subtle ${isVisible ? "visible" : ""}`}
          >
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-blue-500 mb-3">
              {t("aboutUs")}
            </p>

            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              {t("about.mainTitle")}
            </h2>

            <p className="text-base md:text-lg text-gray-600 mb-8 max-w-xl">
              {t("about.homeIntro")}
            </p>

            <Link
              to="/about"
              className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-blue-600 text-white font-semibold text-sm md:text-base hover:bg-blue-700 transition"
            >
              {t("about.ctaButton")}
            </Link>
          </div>

          {/* RIGHT SIDE — gradient hover cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {points.slice(0, 4).map((point, index) => (
              <div
                key={index}
                className={`
                  p-5 rounded-2xl border border-gray-200 shadow-sm 
                  flex items-center transition-all duration-300 cursor-pointer
                  hover:shadow-xl hover:-translate-y-1 hover:border-gray-300
                  ${gradientClasses[index % gradientClasses.length]}
                  animate-lift-blur-subtle ${isVisible ? "visible" : ""}
                `}
                style={{ transitionDelay: `${0.2 + index * 0.1}s` }}
              >
                <p className="font-semibold text-gray-900 text-sm md:text-base leading-snug">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
