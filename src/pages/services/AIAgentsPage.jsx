// src/pages/services/AIAgentsPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useScrollAnimation } from "../../utils/useScrollAnimation";
import { ArrowLeft, ArrowRight, Zap } from "lucide-react";

const AIAgentsPage = () => {
  const { t } = useTranslation();
  const [sectionRef, isVisible] = useScrollAnimation({ threshold: 0.1 });

  const agentIds = [
    "order-confirmation",
    "pdm",
    "content-generation",
    "virtual-secretary",
    "all-in-one",
    "smm",
    "crm",
    "order-processing",
    "kitchen-order",
    "edi",
    "complains",
    "eudr",
    "dpp",
  ];

  return (
    <section className="min-h-screen bg-white pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="max-w-6xl mx-auto px-6">
        {/* Back Button */}
        <Link
          to="/#services"
          className="inline-flex items-center gap-2 text-[#2378FF] hover:text-[#1f5fcc] mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">
            {t("services.backTo", "Back to Services")}
          </span>
        </Link>

        {/* Header */}
        <div
          ref={sectionRef}
          className={`mb-16 ${isVisible ? "lift-up-subtle" : ""}`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2378FF]/10 text-[#2378FF] text-sm font-semibold mb-6">
            <Zap className="w-4 h-4" />
            <span>{t("aiAgentsPage.tagline", "13 Specialized Agents")}</span>
          </div>
          <h2
            className="text-3xl md:text-5xl font-bold text-gray-900 mb-6"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {t("aiAgentsPage.title", "Our AI Workforce")}
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl leading-relaxed">
            {t(
              "aiAgentsPage.description",
              "Stop trying to do everything with one tool. Explore our specialized AI agents, each trained to automate a specific complex process in your company."
            )}
          </p>

          {/* AI Agents Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agentIds.map((agentId, index) => {
              // Note: The structure expects keys like "order-confirmation.badge"
              const badge = t(`${agentId}.badge`, {
                defaultValue: `Agent ${index + 1}`,
              });
              const title = t(`${agentId}.title`, {
                defaultValue: "Coming Soon",
              });
              const subtitle = t(`${agentId}.subtitle`, {
                defaultValue: "Loading agent details...",
              });

              return (
                <Link
                  key={agentId}
                  to={`/services/ai-agents/${agentId}`}
                  className="group flex flex-col justify-between bg-white rounded-2xl p-8 border border-slate-200 hover:border-[#2378FF] hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-[#2378FF] font-bold text-lg group-hover:bg-[#2378FF] group-hover:text-white transition-colors duration-300">
                        {index + 1}
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#2378FF] transition-colors">
                      {badge}
                    </h3>
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#2378FF] mb-3 opacity-80">
                      {title}
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                      {subtitle}
                    </p>
                  </div>

                  <div className="flex items-center text-[#2378FF] font-semibold text-sm group-hover:gap-2 transition-all mt-auto pt-4 border-t border-slate-100">
                    <span>
                      {t("aiAgentsPage.viewCapabilities", "View Capabilities")}
                    </span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div
          className={`${isVisible ? "lift-up-subtle" : ""}`}
          style={{ animationDelay: isVisible ? "0.2s" : "0s" }}
        >
          <div className="bg-gradient-to-br from-[#081333] via-[#1659bd] to-[#fadebc] rounded-3xl p-8 md:p-16 text-center text-white shadow-2xl">
            <h3
              className="text-3xl md:text-4xl font-bold mb-6"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {t("aiAgentsPage.cta.title", "Not sure which Agent you need?")}
            </h3>
            <p className="text-white/90 mb-10 text-lg max-w-2xl mx-auto">
              {t(
                "aiAgentsPage.cta.description",
                "We can analyze your current workflows and tell you exactly which agents will save you the most time and money."
              )}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/business"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#2378FF] font-bold rounded-xl hover:bg-white/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {t("aiAgentsPage.cta.schedule", "Schedule a Consultation")}
              </Link>
              <Link
                to="/#contact"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all"
              >
                {t("aiAgentsPage.cta.contact", "Contact Us")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIAgentsPage;