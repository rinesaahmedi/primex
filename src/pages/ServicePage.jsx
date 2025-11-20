// src/pages/ServicePage.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useScrollAnimation } from "../utils/useScrollAnimation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

const ServicePage = () => {
  const { serviceSlug } = useParams();
  const { t } = useTranslation();
  const [sectionRef, isVisible] = useScrollAnimation({ threshold: 0.1 });

  // Map slugs to service indices (matching the order in translation.json)
  // 0. AI Automation & Virtual Assistants
  // 1. Operational Services
  // 2. Customer Support
  // 3. E-commerce & Product Data
  // 4. Design & 3D Visualization
  // 5. IT Development & Technical Consulting
  const slugToIndex = {
    "ai-agents": 0,              // AI Automation & Virtual Assistants
    "sales-bookkeeping": 1,      // Operational Services
    "assistant-administrator": 2, // Customer Support
    "e-commerce": 3,             // E-commerce & Product Data
    "graphic-designer": 4,       // Design & 3D Visualization
    "software-developer": 5,     // IT Development & Technical Consulting
  };

  const slugToKey = {
    "ai-agents": "aiAgents",
    "software-developer": "softwareDeveloper",
    "graphic-designer": "graphicDesigner",
    "assistant-administrator": "assistantAdministrator",
    "sales-bookkeeping": "salesBookkeeping",
    "e-commerce": "eCommerce",
  };

  const services = t("services.items", { returnObjects: true }) || [];
  const serviceIndex = slugToIndex[serviceSlug];
  const service = serviceIndex !== undefined && services[serviceIndex] ? services[serviceIndex] : null;
  const serviceKey = slugToKey[serviceSlug];
  const serviceDetails = serviceKey
    ? t(`serviceDetails.${serviceKey}`, { returnObjects: true })
    : {};

  const features = Array.isArray(serviceDetails?.features)
    ? serviceDetails.features
    : [];
  const benefits = Array.isArray(serviceDetails?.benefits)
    ? serviceDetails.benefits
    : [];
  const useCases = Array.isArray(serviceDetails?.useCases)
    ? serviceDetails.useCases
    : [];

  // Service-specific content templates
  if (!service) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-white py-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <Link to="/" className="text-[#2378FF] hover:underline">
            Return to Home
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-white py-24 md:py-32">
      <div className="max-w-4xl mx-auto px-6">
        {/* Back Button */}
        <Link
          to="/#services"
          className="inline-flex items-center gap-2 text-[#2378FF] hover:text-[#1f5fcc] mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Services</span>
        </Link>

        {/* Header */}
        <div ref={sectionRef} className={`mb-12 ${isVisible ? 'lift-up-subtle' : ''}`}>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {service.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            {service.description}
          </p>
        </div>

        {/* Features Section */}
        {features.length > 0 && (
          <div
            className={`mb-12 ${isVisible ? 'lift-up-subtle' : ''}`}
            style={{ animationDelay: isVisible ? '0.1s' : '0s' }}
          >
            <h2
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Key Features
            </h2>
            <div className="bg-linear-to-br from-[#0814330d] via-[#2378ff10] to-[#fadebc33] rounded-2xl p-8 md:p-10 border border-slate-100">
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-[#2378FF] shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-base md:text-lg leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Benefits Section */}
        {benefits.length > 0 && (
          <div
            className={`mb-12 ${isVisible ? 'lift-up-subtle' : ''}`}
            style={{ animationDelay: isVisible ? '0.2s' : '0s' }}
          >
            <h2
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Benefits
            </h2>
            <div className="bg-white rounded-2xl p-8 md:p-10 border-2 border-slate-200">
              <ul className="grid md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#2378FF] shrink-0 mt-2" />
                    <span className="text-gray-700 text-base leading-relaxed">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Use Cases Section */}
        {useCases.length > 0 && (
          <div
            className={`mb-12 ${isVisible ? 'lift-up-subtle' : ''}`}
            style={{ animationDelay: isVisible ? '0.3s' : '0s' }}
          >
            <h2
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Ideal For
            </h2>
            <div className="bg-linear-to-br from-slate-50 to-blue-50 rounded-2xl p-8 md:p-10 border border-slate-200">
              <ul className="space-y-3">
                {useCases.map((useCase, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-[#2378FF] font-bold mr-2">•</span>
                    <span className="text-gray-700 text-base md:text-lg leading-relaxed">{useCase}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div
          className={`${isVisible ? 'lift-up-subtle' : ''}`}
          style={{ animationDelay: isVisible ? '0.4s' : '0s' }}
        >
          <div className="bg-linear-to-br from-[#081333] via-[#1659bd] to-[#fadebc] rounded-2xl p-8 md:p-12 text-white">
            <h3
              className="text-2xl md:text-3xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Ready to get started?
            </h3>
            <p className="text-white/90 mb-8 text-lg">
              Let's discuss how we can help transform your operations with our {service.title.toLowerCase()} services.
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

export default ServicePage;

