import React, { useEffect, useState, useRef, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useScrollAnimation } from "../../../utils/useScrollAnimation";
import {
  ArrowLeft,
  CheckCircle2,
  Zap,
  Clock,
  Shield,
  Database,
  TrendingUp,
  Activity,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// =================================================================================
// 1. ALL IMAGE IMPORTS
// =================================================================================

// // --- ALL IN ONE ASSISTANT ---
import allInOne1 from "../../../images/agents/agent-all-in-one-1.jpg";
import allInOne2 from "../../../images/agents/agent-all-in-one-2.png";

// // --- COMPLAINS ---
import complains1 from "../../../images/agents/agent-complaints-1.png";
import complains2 from "../../../images/agents/agent-complaints-2.png";

// // --- CONTENT GENERATION ---
import contentGen1 from "../../../images/agents/agent-content-gen-1.png";
import contentGen2 from "../../../images/agents/agent-content-gen-2.png";

// // --- CRM INTEGRATION ---
import crm1 from "../../../images/agents/agent-crm-1.jpg";
import crm2 from "../../../images/agents/agent-crm-2.jpg";

// // --- DPP ---
import dpp1 from "../../../images/agents/agent-dpp-1.png";

// // --- EDI 2.0 ---
import edi1 from "../../../images/agents/agent-edi-1.png";

// // --- EUDR ---
import eudr1 from "../../../images/agents/agent-eudr-1.jpg";
import eudr2 from "../../../images/agents/agent-eudr-2.jpg";
import eudr3 from "../../../images/agents/agent-eudr-3.jpg";

// // --- KITCHEN ORDER CONFIRMATION ---
import kitchen1 from "../../../images/agents/agent-kitchen-1.png";
import kitchen2 from "../../../images/agents/agent-kitchen-2.png";
import kitchen3 from "../../../images/agents/agent-kitchen-3.png";

// // --- ORDER CONFIRMATION ---
import orderConf1 from "../../../images/agents/agent-order-confirmation-1.jpg";
import orderConf2 from "../../../images/agents/agent-order-confirmation-2.jpg";
import orderConf3 from "../../../images/agents/agent-order-confirmation-3.png";
import orderConf4 from "../../../images/agents/agent-order-confirmation-4.png";

// // --- ORDER PROCESSING ---
import orderProc1 from "../../../images/agents/agent-order-processing-1.png";
import orderProc2 from "../../../images/agents/agent-order-processing-2.png";
import orderProc3 from "../../../images/agents/agent-order-processing-3.png";

// // --- PDM ---
import pdm1 from "../../../images/agents/agent-pdm-1.png";
import pdm2 from "../../../images/agents/agent-pdm-2.png";
import pdm3 from "../../../images/agents/agent-pdm-3.png";

// // --- SMM (Social Media) ---
import smm1 from "../../../images/agents/agent-smm-1.png";
import smm2 from "../../../images/agents/agent-smm-2.png";

// // --- VIRTUAL SECRETARY ---
import vs1 from "../../../images/agents/agent-virtual-secretary-1.png";
import vs2 from "../../../images/agents/agent-virtual-secretary-2.png";
import vs3 from "../../../images/agents/agent-virtual-secretary-3.png";

const placeholderImg = "https://via.placeholder.com/600x400?text=Agent+Image";

// =================================================================================
// 2. CONFIGURATION: MAP JSON KEYS TO IMAGES
// =================================================================================
const AGENT_ASSETS = {
  // Agent 1: Order Confirmation (Has 4 images)
  "order-confirmation": {
    overview: orderConf1,
    capabilities: orderConf2,
    useCases: orderConf3,
    cta: orderConf4,
  },

  // Agent 2: PDM (Has 4 images)
  pdm: {
    overview: pdm1,
    capabilities: pdm2,
    useCases: pdm3,
    cta: pdm3,
  },

  // Agent 3: Content Generation (Has 3 images)
  "content-generation": {
    overview: contentGen2,
    capabilities: contentGen2,
    useCases: contentGen1,
    cta: contentGen1, // Fallback to main
  },

  // Agent 4: Virtual Secretary (Has 4 images)
  "virtual-secretary": {
    overview: vs1,
    capabilities: vs2,
    useCases: vs3,
    cta: vs3,
  },

  // Agent 5: All-in-One (Has 2 images)
  "all-in-one": {
    overview: allInOne1,
    capabilities: allInOne1,
    useCases: allInOne2, // Fallback
    cta: allInOne2, // Fallback
  },

  // Agent 6: Social Media (Has 2 images)
  smm: {
    overview: smm1,
    capabilities: smm1,
    useCases: smm2, // Fallback
    cta: smm2, // Fallback
  },

  // Agent 7: CRM Integration (Has 2 images)
  crm: {
    overview: crm1,
    capabilities: crm1,
    useCases: crm2,
    cta: crm2,
  },

  // Agent 8: Order Processing (Has 3 images)
  "order-processing": {
    overview: orderProc1,
    capabilities: orderProc2,
    useCases: orderProc3,
    cta: orderProc3,
  },

  // Agent 9: Kitchen Order (Has 3 images)
  "kitchen-order": {
    overview: kitchen1,
    capabilities: kitchen2,
    useCases: kitchen3,
    cta: kitchen3,
  },

  // Agent 10: EDI 2.0 (Has 2 images)
  edi: {
    overview: edi1,
    capabilities: edi1,
    useCases: edi1,
    cta: edi1,
  },

  // Agent 11: Complaints (Has 2 images)
  complains: {
    overview: complains1,
    capabilities: complains1,
    useCases: complains2,
    cta: complains2,
  },

  // Agent 12: EUDR (Has 1 image)
  eudr: {
    overview: eudr1,
    capabilities: eudr2,
    useCases: eudr3,
    cta: eudr3,
  },

  // Agent 13: DPP (Has 1 image)
  dpp: {
    overview: dpp1,
    capabilities: dpp1,
    useCases: dpp1,
    cta: dpp1,
  },

  default: {
    overview: placeholderImg,
    capabilities: placeholderImg,
    useCases: placeholderImg,
    cta: placeholderImg,
  },
};

// =================================================================================
// 3. HELPER: MAP URL IDs (agent1) TO JSON KEYS (order-confirmation)
// =================================================================================
const resolveAgentId = (urlId) => {
  const map = {
    agent1: "order-confirmation",
    agent2: "pdm",
    agent3: "content-generation",
    agent4: "virtual-secretary",
    agent5: "all-in-one",
    agent6: "smm",
    agent7: "crm",
    agent8: "order-processing",
    agent9: "kitchen-order",
    agent10: "edi",
    agent11: "complains",
    agent12: "eudr",
    agent13: "dpp",
  };
  return map[urlId] || urlId;
};

const AgentTemplate = () => {
  const { t } = useTranslation();
  const { agentId } = useParams();

  // 1. Resolve the ID
  const actualId = resolveAgentId(agentId);

  const [sectionRef, isVisible] = useScrollAnimation({ threshold: 0.1 });
  const [activeVisual, setActiveVisual] = useState("overview");

  // Mobile gallery state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const galleryRef = useRef(null);

  // 2. Get Assets
  const currentAgentAssets = AGENT_ASSETS[actualId] || AGENT_ASSETS["default"];

  // Get all unique images for mobile gallery (memoized)
  const galleryImages = useMemo(() => {
    const images = [];
    const seen = new Set();
    const sections = ["overview", "capabilities", "useCases", "cta"];

    sections.forEach((section) => {
      const img = currentAgentAssets[section];
      if (img && !seen.has(img)) {
        seen.add(img);
        images.push({
          image: img,
          title: t(`${actualId}.visuals.${section}.title`),
          description: t(`${actualId}.visuals.${section}.description`),
          section: section,
        });
      }
    });

    return images;
  }, [actualId, currentAgentAssets, t]);

  // Reset gallery index when agent changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [actualId]);

  // 3. Scroll Observer
  useEffect(() => {
    const sectionKeys = ["overview", "capabilities", "useCases", "cta"];
    const observers = [];

    sectionKeys.forEach((key) => {
      const el = document.getElementById(`${actualId}-${key}`);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveVisual(key);
          }
        },
        { root: null, threshold: 0.4, rootMargin: "-10% 0px -10% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [actualId]);

  // 4. Section data & summaries used in the sticky visual panel
  const capabilities = t(`${actualId}.capabilities.items`, {
    returnObjects: true,
  });
  const useCaseCards = t(`${actualId}.useCases.cards`, {
    returnObjects: true,
  });

  const capabilitiesSummary = Array.isArray(capabilities)
    ? capabilities.slice(0, 3).join(" ")
    : "";
  const useCasesSummary = Array.isArray(useCaseCards)
    ? useCaseCards
        .slice(0, 2)
        .map((card) => `${card.title}: ${card.body}`)
        .join(" ")
    : "";

  const shortenText = (text, maxChars = 130) => {
    if (!text) return "";
    if (text.length <= maxChars) return text;
    const truncated = text.slice(0, maxChars);
    const lastSpace = truncated.lastIndexOf(" ");
    const safeCut = lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated;
    return safeCut;
  };

  const sectionTexts = {
    overview: {
      title: t(`${actualId}.title`),
      description: shortenText(t(`${actualId}.subtitle`)),
    },
    capabilities: {
      title: t(`${actualId}.capabilities.title`),
      description: shortenText(capabilitiesSummary),
    },
    useCases: {
      title: t(`${actualId}.useCases.title`),
      description: shortenText(useCasesSummary),
    },
    cta: {
      title: t(`${actualId}.cta.title`),
      description: shortenText(t(`${actualId}.cta.body`)),
    },
  };

  const getSectionText = (section) =>
    sectionTexts[section] || sectionTexts.overview;

  // 5. Visual Data
  const currentVisual = {
    image:
      currentAgentAssets[activeVisual] ||
      currentAgentAssets.overview ||
      placeholderImg,
    ...getSectionText(activeVisual),
    label: t(`${actualId}.visuals.label`),
  };

  // Mobile gallery swipe handlers
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentImageIndex < galleryImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
    if (isRightSwipe && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentImageIndex < galleryImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <section className="min-h-screen bg-white pt-28 pb-24 md:pt-36 md:pb-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          {/* LEFT COLUMN (Scrollable Content) */}
          <div>
            <Link
              to="/services/ai-agents"
              className="inline-flex items-center gap-2 text-[#2378FF] hover:text-[#1f5fcc] mb-8 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">{t("backToAgentsLink")}</span>
            </Link>

            {/* Overview Section */}
            <div
              ref={sectionRef}
              id={`${actualId}-overview`}
              className={`mb-12 ${isVisible ? "lift-up-subtle" : ""}`}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2378FF]/10 text-[#2378FF] text-sm font-semibold mb-6">
                <Zap className="w-4 h-4" />
                <span>{t(`${actualId}.badge`)}</span>
              </div>
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {t(`${actualId}.title`)}
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-3xl">
                {t(`${actualId}.subtitle`)}
              </p>
            </div>

            {/* Metrics Section */}
            <div
              className={`grid md:grid-cols-3 gap-6 mb-16 ${
                isVisible ? "lift-up-subtle" : ""
              }`}
              style={{ animationDelay: isVisible ? "0.1s" : "0s" }}
            >
              <div className="bg-gradient-to-br from-[#2378FF] to-[#1f5fcc] rounded-xl p-6 text-white shadow-lg">
                <Clock className="w-8 h-8 mb-3 opacity-90" />
                <div className="text-2xl font-bold mb-1">
                  {t(`${actualId}.metrics.processingTime.value`)}
                </div>
                <div className="text-sm opacity-90">
                  {t(`${actualId}.metrics.processingTime.label`)}
                </div>
              </div>
              <div className="bg-gradient-to-br from-[#CDABFF] to-[#b894ff] rounded-xl p-6 text-white shadow-lg">
                <TrendingUp className="w-8 h-8 mb-3 opacity-90" />
                <div className="text-2xl font-bold mb-1">
                  {t(`${actualId}.metrics.efficiency.value`)}
                </div>
                <div className="text-sm opacity-90">
                  {t(`${actualId}.metrics.efficiency.label`)}
                </div>
              </div>
              <div className="bg-gradient-to-br from-[#FADEBC] to-[#f5d4a8] rounded-xl p-6 text-gray-900 shadow-lg">
                <Shield className="w-8 h-8 mb-3 opacity-80" />
                <div className="text-2xl font-bold mb-1">
                  {t(`${actualId}.metrics.accuracy.value`)}
                </div>
                <div className="text-sm opacity-80">
                  {t(`${actualId}.metrics.accuracy.label`)}
                </div>
              </div>
            </div>

            {/* Capabilities Section */}
            <div
              id={`${actualId}-capabilities`}
              className={`mb-16 ${isVisible ? "lift-up-subtle" : ""}`}
              style={{ animationDelay: isVisible ? "0.2s" : "0s" }}
            >
              <h2
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {t(`${actualId}.capabilities.title`)}
              </h2>
              <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 rounded-2xl p-8 border-2 border-slate-200">
                <div className="grid md:grid-cols-2 gap-4">
                  {Array.isArray(capabilities) &&
                    capabilities.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 bg-white/60 rounded-lg p-4"
                      >
                        <CheckCircle2 className="w-6 h-6 text-[#2378FF] shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Use Cases Section */}
            <div
              id={`${actualId}-useCases`}
              className={`mb-16 ${isVisible ? "lift-up-subtle" : ""}`}
              style={{ animationDelay: isVisible ? "0.3s" : "0s" }}
            >
              <h2
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {t(`${actualId}.useCases.title`)}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {Array.isArray(useCaseCards) &&
                  useCaseCards.map((card, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl p-6 border-2 border-slate-200"
                    >
                      {index === 0 ? (
                        <Database className="w-8 h-8 text-[#2378FF] mb-4" />
                      ) : (
                        <Activity className="w-8 h-8 text-[#CDABFF] mb-4" />
                      )}
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {card.title}
                      </h3>
                      <p className="text-gray-600">{card.body}</p>
                    </div>
                  ))}
              </div>
            </div>

            {/* CTA Section */}
            <div
              id={`${actualId}-cta`}
              className={isVisible ? "lift-up-subtle" : ""}
              style={{ animationDelay: isVisible ? "0.4s" : "0s" }}
            >
              <div className="bg-gradient-to-br from-[#081333] via-[#1659bd] to-[#fadebc] rounded-2xl p-8 md:p-12 text-white">
                <h3
                  className="text-2xl md:text-3xl font-bold mb-4"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {t(`${actualId}.cta.title`)}
                </h3>
                <p className="text-white/90 mb-8 text-lg">
                  {t(`${actualId}.cta.body`)}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/business"
                    className="inline-flex items-center justify-center px-8 py-3 bg-white text-[#2378FF] font-semibold rounded-xl hover:bg-white/90 transition-all shadow-lg hover:shadow-xl"
                  >
                    {t(`${actualId}.cta.primary`)}
                  </Link>
                  <Link
                    to="/#contact"
                    className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-[#2378FF] transition-all"
                  >
                    {t(`${actualId}.cta.secondary`)}
                  </Link>
                </div>
              </div>
            </div>

            {/* Mobile Gallery (Visible only on small screens) */}
            <div className="mt-10 md:hidden">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-md">
                {/* Gallery Container */}
                <div className="relative">
                  {/* Image Container with Swipe */}
                  <div
                    ref={galleryRef}
                    className="relative w-full h-64 overflow-hidden rounded-2xl mb-4"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                  >
                    {/* Image Slider */}
                    <div
                      className="flex transition-transform duration-300 ease-out h-full"
                      style={{
                        transform: `translateX(-${currentImageIndex * 100}%)`,
                      }}
                    >
                      {galleryImages.map((item, index) => (
                        <div
                          key={index}
                          className="min-w-full h-full flex-shrink-0"
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Navigation Arrows */}
                    {galleryImages.length > 1 && (
                      <>
                        {currentImageIndex > 0 && (
                          <button
                            onClick={goToPrevious}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all z-10"
                            aria-label="Previous image"
                          >
                            <ChevronLeft className="w-5 h-5 text-[#2378FF]" />
                          </button>
                        )}
                        {currentImageIndex < galleryImages.length - 1 && (
                          <button
                            onClick={goToNext}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all z-10"
                            aria-label="Next image"
                          >
                            <ChevronRight className="w-5 h-5 text-[#2378FF]" />
                          </button>
                        )}
                      </>
                    )}

                    {/* Image Counter */}
                    {galleryImages.length > 1 && (
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                        {currentImageIndex + 1} / {galleryImages.length}
                      </div>
                    )}
                  </div>

                  {/* Navigation Dots */}
                  {galleryImages.length > 1 && (
                    <div className="flex justify-center gap-2 mb-4">
                      {galleryImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToImage(index)}
                          className={`transition-all rounded-full ${
                            index === currentImageIndex
                              ? "w-8 h-2 bg-[#2378FF]"
                              : "w-2 h-2 bg-slate-300 hover:bg-slate-400"
                          }`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Current Image Info */}
                  {galleryImages[currentImageIndex] && (
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">
                        {galleryImages[currentImageIndex].title}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {galleryImages[currentImageIndex].description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (Sticky Visuals) */}
          <div className="hidden md:block">
            <div className="sticky top-28">
              {/* This container animates when content changes */}
              <div className="rounded-3xl border border-slate-200 bg-slate-50 py-6 px-4 shadow-md transition-all duration-300 flex flex-col gap-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                  {currentVisual.label}
                </p>

                {/* Fixed Height Image Container */}
                <div className="bg-white rounded-2xl overflow-hidden w-full h-64 lg:h-104 shadow-sm border border-slate-100 relative">
                  {/* We use a key here to force re-render animation on image change if desired, or relying on src switch */}
                  <img
                    key={currentVisual.image}
                    src={currentVisual.image}
                    alt={currentVisual.title}
                    className="w-full h-full object-cover animate-fade-in"
                  />
                </div>

                {/* Dynamic Text Description */}
                <div className="mt-2" key={activeVisual}>
                  <h3 className="text-xl font-semibold text-slate-900 animate-slide-up-sm">
                    {currentVisual.title}
                  </h3>
                  <p
                    className="text-sm text-slate-600 mt-1 animate-slide-up-sm"
                    style={{ animationDelay: "0.1s" }}
                  >
                    {currentVisual.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM NAVIGATION: Back to All Agents */}
        <div className="mt-16 flex justify-center border-t border-slate-100 pt-8">
          <Link
            to="/services/ai-agents"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-[#2378FF] transition-colors py-2 px-6 rounded-lg hover:bg-slate-50"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">{t("backToAgentsLink")}</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AgentTemplate;
