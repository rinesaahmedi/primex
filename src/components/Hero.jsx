// src/components/Hero.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Hero = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const statsText = t("hero.statsText");
  const highlights = t("hero.highlights", { returnObjects: true }) || [];
  const [isVisible, setIsVisible] = useState(false);

  const LAYOUT = "max-w-7xl mx-auto lg:px-12";
  useEffect(() => {
    // Trigger animations on mount
    setIsVisible(true);
  }, []);

  return (
    <section className="hero-section relative isolate overflow-hidden px-6 py-24 md:py-32 lg:py-40">
      <div className="hero-base" aria-hidden="true" />
      <div className="hero-glow hero-glow--one" aria-hidden="true" />
      <div className="hero-glow hero-glow--two" aria-hidden="true" />
      <div
        className={`relative ${LAYOUT} grid items-center gap-12 lg:gap-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]`}
      >
        {/* Copy */}
        <div className="space-y-10 text-left text-white">
          <span
            className={`hero-pill animate-lift-blur-subtle ${
              isVisible ? "visible" : ""
            }`}
          >
            {t("hero.kicker")}
          </span>

          <div
            className={`animate-lift-blur-subtle ${isVisible ? "visible" : ""}`}
            style={{ transitionDelay: "0.1s" }}
          >
            <p className="hero-eyebrow">{t("hero.headline.emphasis")}</p>
            <h1 className="hero-headline">
              <span className="hero-headline__emphasis">
                {t("hero.headline.emphasis")}
              </span>{" "}
              <span className="hero-headline__gradient">
                {t("hero.headline.rest")}
              </span>
            </h1>
          </div>

          <p
            className={`max-w-xl text-lg md:text-xl text-slate-100/90 animate-lift-blur-subtle ${
              isVisible ? "visible" : ""
            }`}
            style={{ transitionDelay: "0.2s" }}
          >
            {t("hero.body")}
          </p>

          <div
            className={`flex flex-wrap gap-4 animate-lift-blur-subtle ${
              isVisible ? "visible" : ""
            }`}
            style={{ transitionDelay: "0.3s" }}
          >
            <button
              className="hero-cta hero-cta--primary"
              type="button"
              onClick={() => navigate("/business")}
            >
              {t("hero.primaryCta")}
            </button>
          </div>

          <p
            className={`hero-stats-text animate-lift-blur-subtle ${
              isVisible ? "visible" : ""
            }`}
            style={{ transitionDelay: "0.4s" }}
          >
            {statsText}
          </p>
        </div>

        {/* Right column */}
        <div
          className={`hero-right-panel bg-white/10 border border-white/20 text-slate-900 animate-lift-blur ${
            isVisible ? "visible" : ""
          }`}
          style={{ transitionDelay: "0.2s" }}
        >
          <p className="hero-right-title">{t("hero.rightTitle")}</p>
          <p className="hero-right-body">{t("hero.rightBody")}</p>

          <div className="hero-right-grid grid grid-cols-1 gap-4 md:grid-cols-2">
            {highlights.map((item, index) => (
              <div
                key={item.title}
                className={`hero-right-card animate-lift-blur-subtle ${
                  isVisible ? "visible" : ""
                }`}
                style={{ transitionDelay: `${0.4 + index * 0.1}s` }}
              >
                <p className="hero-right-card__title">{item.title}</p>
                <p className="hero-right-card__description">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
