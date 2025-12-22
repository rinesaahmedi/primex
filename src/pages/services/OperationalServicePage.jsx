// src/pages/services/SalesBookkeepingPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useScrollAnimation } from "../../utils/useScrollAnimation";
import { 
  ArrowLeft, 
  ShoppingCart, 
  Calculator,   
  Truck,        
  ClipboardCheck, 
  TrendingUp, 
  CheckCircle2, 
  Globe,
  Award,
  Coins
} from "lucide-react";

// !!! IMPORTANT: Import the image here
// Make sure the path matches where you saved the file
import operationalDiagram from "../../assets/Services/operational-services-diagram.png";

const OperationalServicePage = () => {
  const { t } = useTranslation();
  const [sectionRef, isVisible] = useScrollAnimation({ threshold: 0.1 });

  const services = [
    {
      key: "orderProcessing",
      icon: <ClipboardCheck className="w-8 h-8 text-[#2378FF] mb-4" />,
      bg: "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100",
      textColor: "text-[#2378FF]"
    },
    {
      key: "logistics",
      icon: <Truck className="w-8 h-8 text-[#FADEBC] mb-4" />,
      bg: "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100",
      textColor: "text-[#FADEBC]"
    },
    {
      key: "sales",
      icon: <TrendingUp className="w-8 h-8 text-[#CDABFF] mb-4" />,
      bg: "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100",
      textColor: "text-[#CDABFF]"
    },
    {
      key: "bookkeeping",
      icon: <Calculator className="w-8 h-8 text-[#2378FF] mb-4" />,
      bg: "bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100",
      textColor: "text-[#2378FF]"
    }
  ];

  const whyChooseIcons = [
    <Award className="w-6 h-6 text-[#2378FF]" />,
    <Coins className="w-6 h-6 text-[#2378FF]" />,
    <CheckCircle2 className="w-6 h-6 text-[#2378FF]" />,
    <Globe className="w-6 h-6 text-[#2378FF]" />
  ];

  return (
    <section className="min-h-screen bg-white pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Navigation */}
        <Link
          to="/#services"
          className="inline-flex items-center gap-2 text-[#2378FF] hover:text-[#1f5fcc] mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">
            {t("services.backTo", "Back to Services")}
          </span>
        </Link>

        {/* 1. Header & Intro */}
        <div ref={sectionRef} className={`mb-12 ${isVisible ? 'lift-up-subtle' : ''}`}>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {t("operationalServices.title")}
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 font-medium mb-4">
            {t("operationalServices.subtitle")}
          </p>
          
          <div className="mt-8 p-6 bg-slate-50 rounded-2xl border-l-4 border-[#2378FF]">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {t("operationalServices.intro.title")}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {t("operationalServices.intro.description")}
            </p>
          </div>
        </div>

        {/* 2. Visual Ecosystem (THE NEW IMAGE) */}
        {/* We place the image here to visualize the text above before diving into details */}
        <div 
          className={`mb-20 ${isVisible ? 'lift-up-subtle' : ''}`}
          style={{ animationDelay: isVisible ? '0.1s' : '0s' }}
        >
          <div className="relative group">
            {/* Background decorative glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-3xl blur opacity-50 group-hover:opacity-75 transition duration-1000"></div>
            
            {/* The Image Container */}
            <div className="relative bg-white rounded-2xl p-4 md:p-8 shadow-xl border border-slate-100 overflow-hidden">
              <h3 className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">
                Operational Workflow Overview
              </h3>
              <img 
                src={operationalDiagram} 
                alt="Operational Services Diagram showing Order Processing, Logistics, Sales, and Bookkeeping" 
                className="w-full h-auto object-contain mx-auto"
              />
            </div>
          </div>
        </div>

        {/* 3. Detailed Services Grid */}
        <div 
          className={`mb-16 ${isVisible ? 'lift-up-subtle' : ''}`}
          style={{ animationDelay: isVisible ? '0.2s' : '0s' }}
        >
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-8"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {t("operationalServices.sectionsTitle", "Service Details")}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service) => {
              const title = t(`operationalServices.sections.${service.key}.title`);
              const description = t(`operationalServices.sections.${service.key}.description`);
              const features = t(`operationalServices.sections.${service.key}.features`, { returnObjects: true });

              return (
                <div key={service.key} className={`${service.bg} rounded-2xl p-8 border hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
                  {service.icon}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
                  <p className="text-gray-600 mb-6">{description}</p>
                  
                  <ul className="space-y-3 bg-white/60 p-4 rounded-xl">
                    {Object.values(features).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className={`w-4 h-4 ${service.textColor} shrink-0 mt-0.5`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Why Choose PrimEx */}
        <div 
          className={`mb-16 ${isVisible ? 'lift-up-subtle' : ''}`}
          style={{ animationDelay: isVisible ? '0.3s' : '0s' }}
        >
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-8"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {t("operationalServices.whyChoose.title")}
          </h2>
          
          <div className="bg-white rounded-2xl p-8 border-2 border-slate-200 shadow-sm">
            <div className="grid md:grid-cols-2 gap-8">
              {t("operationalServices.whyChoose.items", { returnObjects: true }).map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl shrink-0">
                     {whyChooseIcons[index] || <CheckCircle2 className="w-6 h-6 text-[#2378FF]" />}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Call to Action */}
        <div 
          className={`${isVisible ? 'lift-up-subtle' : ''}`}
          style={{ animationDelay: isVisible ? '0.4s' : '0s' }}
        >
          <div className="bg-gradient-to-br from-[#081333] via-[#1659bd] to-[#fadebc] rounded-2xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            
            <div className="relative z-10">
              <h3
                className="text-2xl md:text-3xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                {t("operationalServices.cta.title", "Ready to optimize your operations?")}
              </h3>
              <p className="text-white/90 mb-8 text-lg max-w-2xl">
                {t("operationalServices.cta.description", "Let's discuss how our operational services can streamline your business and boost your efficiency.")}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/business"
                  className="inline-flex items-center justify-center px-8 py-3 bg-white text-[#2378FF] font-semibold rounded-xl hover:bg-white/90 transition-all shadow-lg hover:shadow-xl"
                >
                  {t("operationalServices.cta.primary", "Get in Touch")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OperationalServicePage;
