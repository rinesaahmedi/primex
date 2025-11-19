// src/pages/services/agents/Agent2Page.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "../../../utils/useScrollAnimation";
import { ArrowLeft, CheckCircle2, Zap, Clock, Shield, Database, TrendingUp, Activity } from "lucide-react";

const Agent2Page = () => {
  const [sectionRef, isVisible] = useScrollAnimation({ threshold: 0.1 });

  return (
    <section className="min-h-screen bg-white pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="max-w-5xl mx-auto px-6">
        <Link
          to="/services/ai-agents"
          className="inline-flex items-center gap-2 text-[#2378FF] hover:text-[#1f5fcc] mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to AI Agents</span>
        </Link>

        <div ref={sectionRef} className={`mb-12 ${isVisible ? 'lift-up-subtle' : ''}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2378FF]/10 text-[#2378FF] text-sm font-semibold mb-6">
            <Zap className="w-4 h-4" />
            <span>AI Operations Agent</span>
          </div>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Agent 2
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-3xl">
            Specialized AI agent designed to automate and optimize operational workflows with precision and efficiency.
          </p>
        </div>

        {/* Key Metrics */}
        <div 
          className={`grid md:grid-cols-3 gap-6 mb-12 ${isVisible ? 'lift-up-subtle' : ''}`}
          style={{ animationDelay: isVisible ? '0.1s' : '0s' }}
        >
          <div className="bg-gradient-to-br from-[#2378FF] to-[#1f5fcc] rounded-xl p-6 text-white shadow-lg">
            <Clock className="w-8 h-8 mb-3 opacity-90" />
            <div className="text-3xl font-bold mb-1">70s</div>
            <div className="text-sm opacity-90">Processing Time</div>
          </div>
          <div className="bg-gradient-to-br from-[#CDABFF] to-[#b894ff] rounded-xl p-6 text-white shadow-lg">
            <TrendingUp className="w-8 h-8 mb-3 opacity-90" />
            <div className="text-3xl font-bold mb-1">10x</div>
            <div className="text-sm opacity-90">Efficiency Gain</div>
          </div>
          <div className="bg-gradient-to-br from-[#FADEBC] to-[#f5d4a8] rounded-xl p-6 text-gray-900 shadow-lg">
            <Shield className="w-8 h-8 mb-3 opacity-80" />
            <div className="text-3xl font-bold mb-1">99.9%</div>
            <div className="text-sm opacity-80">Accuracy Rate</div>
          </div>
        </div>

        {/* Features */}
        <div 
          className={`mb-12 ${isVisible ? 'lift-up-subtle' : ''}`}
          style={{ animationDelay: isVisible ? '0.2s' : '0s' }}
        >
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Capabilities
          </h2>
          <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 rounded-2xl p-8 border-2 border-slate-200">
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Automated workflow processing",
                "Real-time data synchronization",
                "Multi-language support (DE/EN)",
                "ERP system integration",
                "24/7 continuous operation",
                "Human-in-the-loop oversight",
                "Quality assurance checks",
                "Performance analytics"
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-3 bg-white/60 rounded-lg p-4">
                  <CheckCircle2 className="w-6 h-6 text-[#2378FF] shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div 
          className={`mb-12 ${isVisible ? 'lift-up-subtle' : ''}`}
          style={{ animationDelay: isVisible ? '0.3s' : '0s' }}
        >
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Use Cases
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
              <Database className="w-8 h-8 text-[#2378FF] mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Processing</h3>
              <p className="text-gray-600">Automated processing of operational data with high accuracy and speed.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
              <Activity className="w-8 h-8 text-[#CDABFF] mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Workflow Automation</h3>
              <p className="text-gray-600">Streamline complex workflows with intelligent automation.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div 
          className={`${isVisible ? 'lift-up-subtle' : ''}`}
          style={{ animationDelay: isVisible ? '0.4s' : '0s' }}
        >
          <div className="bg-gradient-to-br from-[#081333] via-[#1659bd] to-[#fadebc] rounded-2xl p-8 md:p-12 text-white">
            <h3
              className="text-2xl md:text-3xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Interested in Agent 2?
            </h3>
            <p className="text-white/90 mb-8 text-lg">
              Let's discuss how this agent can transform your operations.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/business"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-[#2378FF] font-semibold rounded-xl hover:bg-white/90 transition-all shadow-lg hover:shadow-xl"
              >
                Get in Touch
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

export default Agent2Page;
