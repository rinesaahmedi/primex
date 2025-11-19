// src/components/Hero.jsx
import React from "react";
import { useTranslation } from "react-i18next";

const Hero = () => {
  const { t } = useTranslation();
  const statsText = t("hero.statsText");
  const highlights = t("hero.highlights", { returnObjects: true }) || [];

  return (
    <section className="hero-section relative isolate overflow-hidden px-6 py-24 md:py-32 lg:py-40">
      <div className="hero-base" aria-hidden="true" />
      <div className="hero-glow hero-glow--one" aria-hidden="true" />
      <div className="hero-glow hero-glow--two" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:gap-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        {/* Copy */}
        <div className="space-y-10 text-left text-white">
          <span className="hero-pill">{t("hero.kicker")}</span>

          <div>
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

          <p className="max-w-xl text-lg md:text-xl text-slate-100/90">
            {t("hero.body")}
          </p>

          <div className="flex flex-wrap gap-4">
            <button className="hero-cta hero-cta--primary">
              {t("hero.primaryCta")}
            </button>
          </div>

          <p className="hero-stats-text">{statsText}</p>
        </div>

        {/* Right column */}
        <div className="hero-right-panel bg-white/10 border border-white/20 text-slate-900">
          <p className="hero-right-title">{t("hero.rightTitle")}</p>
          <p className="hero-right-body">{t("hero.rightBody")}</p>

          <div className="hero-right-grid grid grid-cols-1 gap-4 md:grid-cols-2">
            {highlights.map((item) => (
              <div key={item.title} className="hero-right-card">
                <p className="hero-right-card__title">{item.title}</p>
                <p className="hero-right-card__description">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
