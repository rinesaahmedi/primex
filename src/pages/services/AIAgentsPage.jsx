// src/pages/services/AIAgentsPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useScrollAnimation } from "../../utils/useScrollAnimation";
import { ArrowLeft, CheckCircle2, Zap, Clock, Shield, Globe, Database, TrendingUp, DollarSign, Users, Activity, BarChart3 } from "lucide-react";

const AIAgentsPage = () => {
  const { t } = useTranslation();
  const [sectionRef, isVisible] = useScrollAnimation({ threshold: 0.1 });

  return (
    <section className="min-h-screen bg-white pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="max-w-5xl mx-auto px-6">
        {/* Back Button */}
        <Link
          to="/#services"
          className="inline-flex items-center gap-2 text-[#2378FF] hover:text-[#1f5fcc] mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Services</span>
        </Link>

        

        {/* AI Agents Grid */}
        <div 
          className={`mb-16 ${isVisible ? 'lift-up-subtle' : ''}`}
          style={{ animationDelay: isVisible ? '0.5s' : '0s' }}
        >
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-8"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Our AI Agents
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl">
            Explore our specialized AI agents designed to automate and optimize different aspects of your operations.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((agentNum) => (
              <Link
                key={agentNum}
                to={`/services/ai-agents/agent${agentNum}`}
                className="group bg-white rounded-xl p-6 border-2 border-slate-200 hover:border-[#2378FF] hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#2378FF] to-[#1f5fcc] flex items-center justify-center text-white font-bold text-lg">
                    {agentNum}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-[#2378FF] transition-colors">
                      Agent {agentNum}
                    </h3>
                    <p className="text-sm text-gray-500">AI Operations Agent</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Specialized AI agent designed to automate and optimize operational workflows.
                </p>
                <div className="flex items-center text-[#2378FF] font-semibold text-sm group-hover:gap-2 transition-all">
                  <span>Learn more</span>
                  <ArrowLeft className="w-4 h-4 ml-1 rotate-180 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div 
          className={`${isVisible ? 'lift-up-subtle' : ''}`}
          style={{ animationDelay: isVisible ? '0.6s' : '0s' }}
        >
          <div className="bg-gradient-to-br from-[#081333] via-[#1659bd] to-[#fadebc] rounded-2xl p-8 md:p-12 text-white">
            <h3
              className="text-2xl md:text-3xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Ready to Transform Your Operations?
            </h3>
            <p className="text-white/90 mb-8 text-lg max-w-2xl">
              Let's discuss how AI agents can automate your workflows and reduce operational costs by up to 80%.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/business"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-[#2378FF] font-semibold rounded-xl hover:bg-white/90 transition-all shadow-lg hover:shadow-xl"
              >
                Schedule a Consultation
              </Link>
              <Link
                to="/#contact"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-[#2378FF] transition-all"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIAgentsPage;

