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

  // Map slugs to service indices
  const slugToIndex = {
    "ai-agents": 0,
    "software-developer": 1,
    "graphic-designer": 2,
    "assistant-administrator": 3,
    "sales-bookkeeping": 4,
    "e-commerce": 5,
  };

  const services = t("services.items", { returnObjects: true }) || [];
  const serviceIndex = slugToIndex[serviceSlug];
  const service = serviceIndex !== undefined && services[serviceIndex] ? services[serviceIndex] : null;

  // Service-specific content templates
  const serviceContent = {
    "ai-agents": {
      features: [
        "Claims automation — Process claims from 90 minutes to 70 seconds",
        "Product data management — Real-time synchronization across marketplaces",
        "Logistics coordination — Automated tracking and updates",
        "Customer service workflows — 24/7 automated support",
        "ERP integration — Seamless connection with existing systems",
        "Human-in-the-loop oversight — Quality assurance and compliance"
      ],
      benefits: [
        "Reduce operational costs by up to 80%",
        "Process claims 10x faster than manual workflows",
        "24/7 automated processing without extra headcount",
        "Built on 40+ years of furniture industry expertise",
        "Multi-language support (DE/EN and more)",
        "Compliance with industry standards and SLAs"
      ],
      useCases: [
        "Furniture retailers processing warranty claims",
        "E-commerce platforms managing product data",
        "Logistics companies tracking shipments",
        "Customer service departments handling inquiries"
      ]
    },
    "software-developer": {
      features: [
        "Custom software development — Tailored to your business needs",
        "ERP/CRM integration — Connect existing systems seamlessly",
        "Virtual agent integration — AI-powered automation",
        "Order processing systems — Streamlined workflows",
        "Data management solutions — Secure and efficient",
        "Cybersecurity measures — Protect your digital assets"
      ],
      benefits: [
        "Scalable solutions that grow with your business",
        "Data protection concepts and compliance",
        "Strong cybersecurity measures",
        "Multilingual support for global operations",
        "Integration with existing infrastructure",
        "Ongoing IT support and maintenance"
      ],
      useCases: [
        "Businesses needing custom software solutions",
        "Companies requiring ERP/CRM integration",
        "Organizations seeking automation tools",
        "Businesses needing data management systems"
      ]
    },
    "graphic-designer": {
      features: [
        "Brand identity design — Logos, color schemes, and visual guidelines",
        "Web design — Responsive and modern interfaces",
        "Marketing materials — Brochures, flyers, and presentations",
        "Product photography — High-quality visual content",
        "Social media graphics — Engaging content for all platforms",
        "Packaging design — Eye-catching product packaging"
      ],
      benefits: [
        "Fast turnaround times without compromising quality",
        "Creative and precision-focused designs",
        "Brand consistency across all materials",
        "Professional results that exceed expectations",
        "Tailored solutions for your vision",
        "Experienced design team with industry expertise"
      ],
      useCases: [
        "Companies launching new brands",
        "Businesses redesigning their visual identity",
        "E-commerce stores needing product visuals",
        "Marketing teams requiring campaign materials"
      ]
    },
    "assistant-administrator": {
      features: [
        "Research and analysis — Comprehensive market and competitor research",
        "Report preparation — Professional documents and presentations",
        "Communication management — Email, phone, and correspondence",
        "Schedule coordination — Calendar management and meeting planning",
        "Data entry and organization — Accurate record keeping",
        "Document management — Filing and organization systems"
      ],
      benefits: [
        "Streamlined daily operations",
        "Professional handling of administrative tasks",
        "Time savings for core business activities",
        "Efficient and organized workflows",
        "Multilingual support (DE/EN)",
        "Cost-effective administrative solutions"
      ],
      useCases: [
        "Growing businesses needing administrative support",
        "Companies expanding into new markets",
        "Organizations requiring multilingual administration",
        "Businesses seeking to optimize operations"
      ]
    },
    "sales-bookkeeping": {
      features: [
        "Global sales management — Wholesale and retail coordination",
        "Production planning — Optimize manufacturing schedules",
        "Logistics coordination — Streamlined supply chain management",
        "E-commerce solutions — B2B and B2C platforms",
        "Accurate bookkeeping — Transaction recording and reporting",
        "Financial compliance — Accounting standards adherence"
      ],
      benefits: [
        "Comprehensive sales and financial management",
        "Accurate financial reporting and analysis",
        "Compliance with international accounting standards",
        "Streamlined operations across channels",
        "Production and logistics optimization",
        "Smooth financial operations"
      ],
      useCases: [
        "Furniture manufacturers managing global sales",
        "Retailers needing bookkeeping services",
        "E-commerce businesses requiring financial management",
        "Companies seeking production and logistics coordination"
      ]
    },
    "e-commerce": {
      features: [
        "Custom e-commerce websites — Tailored to your brand",
        "Responsive design — Mobile and desktop optimized",
        "Payment integration — Secure checkout systems",
        "Inventory management — Real-time stock tracking",
        "SEO optimization — Improved search visibility",
        "Analytics and reporting — Track performance metrics"
      ],
      benefits: [
        "Strengthened online presence",
        "Continuous business growth",
        "Custom solutions for your brand",
        "User-friendly shopping experiences",
        "Scalable platforms that grow with you",
        "Professional development and support"
      ],
      useCases: [
        "Businesses launching online stores",
        "Companies expanding to e-commerce",
        "Retailers needing custom platforms",
        "Brands seeking to improve online presence"
      ]
    }
  };

  const content = serviceContent[serviceSlug] || { features: [], benefits: [], useCases: [] };

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
        {content.features.length > 0 && (
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
            <div className="bg-gradient-to-br from-[#0814330d] via-[#2378ff10] to-[#fadebc33] rounded-2xl p-8 md:p-10 border border-slate-100">
              <ul className="space-y-4">
                {content.features.map((feature, index) => (
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
        {content.benefits.length > 0 && (
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
                {content.benefits.map((benefit, index) => (
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
        {content.useCases.length > 0 && (
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
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 md:p-10 border border-slate-200">
              <ul className="space-y-3">
                {content.useCases.map((useCase, index) => (
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
          <div className="bg-gradient-to-br from-[#081333] via-[#1659bd] to-[#fadebc] rounded-2xl p-8 md:p-12 text-white">
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

