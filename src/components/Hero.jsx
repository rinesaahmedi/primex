// src/components/Hero.jsx
import React from "react";
import { useTranslation } from "react-i18next";

const Hero = () => {
  const { t } = useTranslation();
  const stats = t("hero.statCards", { returnObjects: true }) || [];
  const dashboard = t("hero.dashboard", { returnObjects: true }) || {};
  const dashboardMetrics = dashboard.metrics || [];
  const dashboardEvents = dashboard.events || [];
  const dashboardImage = dashboard.image;

  return (
    <section className="hero-section relative isolate overflow-hidden px-6 py-24 md:py-32 lg:py-40">
      <div className="hero-base" aria-hidden="true" />
      <div className="hero-triangle" aria-hidden="true" />
      <div className="hero-glow hero-glow--one" aria-hidden="true" />
      <div className="hero-glow hero-glow--two" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
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
            <button className="hero-cta hero-cta--secondary">
              {t("hero.secondaryCta")}
            </button>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-slate-100/80">
            {stats.map((stat) => (
              <div key={stat.label} className="space-y-1">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-200/70">
                  {stat.label}
                </p>
                <p className="text-2xl font-semibold text-white">{stat.value}</p>
                <p className="text-emerald-200">{stat.delta}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Visual */}
        <div className="relative flex flex-col items-center gap-6">
          <div className="hero-dashboard">
            <div className="hero-dashboard__badge">{dashboard.badge}</div>

            <div className="hero-dashboard__top">
              <div>
                <p className="hero-dashboard__title">{dashboard.title}</p>
                <p className="hero-dashboard__summary">{dashboard.summary}</p>
              </div>
              <div className="hero-dashboard__status">
                <p className="hero-dashboard__status-label">
                  {dashboard.statusLabel}
                </p>
                <p className="hero-dashboard__status-value">
                  {dashboard.statusValue}
                </p>
              </div>
            </div>

            <div className="hero-dashboard__metrics">
              {dashboardMetrics.map((metric) => (
                <div key={metric.label}>
                  <p className="hero-dashboard__metric-label">{metric.label}</p>
                  <p className="hero-dashboard__metric-value">{metric.value}</p>
                </div>
              ))}
            </div>

            <div className="hero-dashboard__events">
              {dashboardEvents.map((event) => (
                <div key={`${event.time}-${event.text}`} className="hero-event">
                  <span>{event.time}</span>
                  <p>{event.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-image-shell">
            {dashboardImage ? (
              <img
                src={dashboardImage}
                alt={dashboard.imageAlt}
                className="hero-image"
              />
            ) : (
              <div className="hero-device-placeholder">
                <p>{t("hero.placeholderNote")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
