// src/pages/services/SalesBookkeepingPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useScrollAnimation } from "../../utils/useScrollAnimation";
import { ArrowLeft, CheckCircle2, ShoppingCart, Calculator, TrendingUp, Package } from "lucide-react";

const SalesBookkeepingPage = () => {
  const { t } = useTranslation();
  const [sectionRef, isVisible] = useScrollAnimation({ threshold: 0.1 });

  return (
    <section className="min-h-screen bg-white pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="max-w-4xl mx-auto px-6">
        <Link
          to="/#services"
          className="inline-flex items-center gap-2 text-[#2378FF] hover:text-[#1f5fcc] mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Services</span>
        </Link>

        <div ref={sectionRef} className={`mb-12 ${isVisible ? 'lift-up-subtle' : ''}`}>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Sales & Bookkeeping
          </h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            {t("services.items.4.description")}
          </p>
        </div>

        <div 
          className={`mb-12 ${isVisible ? 'lift-up-subtle' : ''}`}
          style={{ animationDelay: isVisible ? '0.1s' : '0s' }}
        >
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Our Services
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <ShoppingCart className="w-8 h-8 text-[#2378FF] mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Sales Management</h3>
              <p className="text-gray-600">Global wholesale and retail sales coordination for B2B and B2C channels.</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
              <Package className="w-8 h-8 text-[#CDABFF] mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Production Planning</h3>
              <p className="text-gray-600">Optimize manufacturing schedules and coordinate production workflows.</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
              <TrendingUp className="w-8 h-8 text-[#FADEBC] mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Logistics Coordination</h3>
              <p className="text-gray-600">Streamlined supply chain management and distribution.</p>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100">
              <Calculator className="w-8 h-8 text-[#2378FF] mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Bookkeeping</h3>
              <p className="text-gray-600">Accurate transaction recording, financial reporting, and compliance.</p>
            </div>
          </div>
        </div>

        <div 
          className={`mb-12 ${isVisible ? 'lift-up-subtle' : ''}`}
          style={{ animationDelay: isVisible ? '0.2s' : '0s' }}
        >
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Key Benefits
          </h2>
          <div className="bg-white rounded-2xl p-8 border-2 border-slate-200">
            <ul className="grid md:grid-cols-2 gap-4">
              {[
                "Comprehensive sales and financial management",
                "Accurate financial reporting and analysis",
                "Compliance with international accounting standards",
                "Streamlined operations across channels",
                "Production and logistics optimization",
                "Smooth financial operations"
              ].map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#2378FF] shrink-0 mt-0.5" />
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div 
          className={`${isVisible ? 'lift-up-subtle' : ''}`}
          style={{ animationDelay: isVisible ? '0.3s' : '0s' }}
        >
          <div className="bg-gradient-to-br from-[#081333] via-[#1659bd] to-[#fadebc] rounded-2xl p-8 md:p-12 text-white">
            <h3
              className="text-2xl md:text-3xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Ready to get started?
            </h3>
            <p className="text-white/90 mb-8 text-lg">
              Let's optimize your sales and financial operations.
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

export default SalesBookkeepingPage;

