// src/components/About.jsx  (HOME VERSION – improved teaser)
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const About = () => {
  const { t } = useTranslation();
  const points = t("about.whyPrimex.points", { returnObjects: true }) || [];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* LEFT: Text + CTA */}
          <div>
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

          {/* RIGHT: Key reasons in cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {points.slice(0, 4).map((point, index) => (
              <div
                key={index}
                className="h-full p-5 bg-gray-50 rounded-2xl border border-gray-100 flex items-center"
              >
                <p className="font-semibold text-gray-800 text-sm md:text-base leading-snug">
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
