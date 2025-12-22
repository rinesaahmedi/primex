// src/pages/AboutPage.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion"; // Import framer-motion
import pxBranding from "../images/40.jpg";

const AboutPage = () => {
  const { t } = useTranslation();

  // Data retrieval
  const expertise = t("about.expertise.items", { returnObjects: true }) || [];
  const aiFeatures = t("about.aiAgent.features", { returnObjects: true }) || [];
  const whyPrimex = t("about.whyPrimex.points", { returnObjects: true }) || [];

  // --- Animation Variants ---
  
  // 1. Standard Fade Up (for text blocks)
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
    }
  };

  // 2. Stagger Container (for lists/grids)
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Time between each item appearing
      }
    }
  };

  // 3. Child Item Animation (for items inside a staggered container)
  const itemFade = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // 4. Hero Image Entrance
  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { duration: 0.8, ease: "easeOut" } 
    }
  };

  return (
    <div className="bg-gray-50 overflow-x-hidden font-sans text-gray-800">
      {/* -------------------------------------------------------
         HERO SECTION: Impact & Branding
      -------------------------------------------------------- */}
      <section className="relative min-h-[65vh] flex items-center pt-40 pb-24 lg:pt-48 lg:pb-40 bg-[#0B1120] text-white">
        {/* Background Gradients - Added subtle pulse animation */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 right-0 w-[700px] h-[600px] bg-[#2378FF]/20 blur-[120px] rounded-full pointer-events-none" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#CDABFF]/10 blur-[100px] rounded-full pointer-events-none" 
        />

        <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-7xl relative z-10 grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">
          {/* Text Content - Animated on Load */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.span 
              variants={fadeInUp}
              className="inline-block py-1 px-3 rounded-full bg-[#2378FF]/20 border border-[#2378FF]/50 text-[#60A5FA] text-xs font-bold tracking-widest uppercase mb-8"
            >
              {t("about.pill")}
            </motion.span>
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-8"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {t("about.mainTitle")}
            </motion.h1>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-gray-300 mb-10 leading-relaxed max-w-lg"
            >
              {t("about.storySubtitle")}
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              <div className="pl-4 border-l-4 border-[#2378FF]">
                <p className="text-white font-semibold text-lg">
                  {t("about.tagline")}
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Image Composition - Animated Scale & Float */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={scaleIn}
            className="relative lg:scale-110"
          >
            {/* Added a floating Y animation to the image container */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group"
            >
              <img
                src={pxBranding}
                alt={t("about.imageAlt")}
                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent opacity-60" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* -------------------------------------------------------
         SECTION 2: Who We Are (The Narrative)
      -------------------------------------------------------- */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl text-center">
          {/* Triggers animation when 30% of element is in view */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {t("about.whoWeAre.title")}
            </h2>
            <p className="text-xl text-[#2378FF] font-medium mb-6">
              {t("about.whoWeAre.description")}
            </p>
            <p className="text-gray-600 leading-relaxed text-lg mx-auto max-w-2xl">
              {t("about.whoWeAre.additional")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* -------------------------------------------------------
         SECTION 3: Expertise (Grid Layout)
      -------------------------------------------------------- */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-7xl">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {t("about.expertise.title")}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("about.expertise.description")}
            </p>
          </motion.div>

          {/* Expertise Grid - Staggered Appearance */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {expertise.map((item, idx) => (
              <motion.div
                key={idx}
                variants={itemFade}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#2378FF]/30 transition-all duration-300 flex items-start gap-4"
              >
                <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#2378FF]">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-gray-800 font-medium">
                  {item.replace(/•\s*/g, "")}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* -------------------------------------------------------
         SECTION 4: AI Evolution (Dark Mode Contrast)
      -------------------------------------------------------- */}
      <section className="py-24 bg-[#0F172A] text-white relative overflow-hidden">
        {/* Decorative Circles - Pulsing */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }} 
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-purple-500/20 rounded-full blur-[80px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1] }} 
          transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
          className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]" 
        />

        <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-6xl relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            
            {/* Left: Text - Fades in from Left */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 mb-4 text-purple-300 font-semibold tracking-wide text-sm uppercase">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                Innovation
              </div>
              <h2
                className="text-3xl md:text-5xl font-bold mb-6 leading-tight"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {t("about.aiEvolution.title")}
              </h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                {t("about.aiEvolution.description")}
              </p>
              
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {t("about.aiAgent.title")}
                </h3>
                <p className="text-sm text-gray-400">
                  Seamless integration of automated intelligence into daily workflows.
                </p>
              </div>
            </motion.div>

            {/* Right: Feature Cards - Staggered from Right */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="space-y-4"
            >
              {aiFeatures.map((feature, idx) => (
                <motion.div
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, x: 50 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
                  }}
                  className="group flex items-center gap-4 p-5 bg-[#1E293B] rounded-xl border border-gray-700 hover:border-[#2378FF] transition-all duration-300 hover:bg-[#1E293B]/80"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2378FF] to-purple-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-lg font-medium text-gray-200 group-hover:text-white">
                    {feature}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------
         SECTION 5: Vision & Why PrimEx (Bento Grid)
      -------------------------------------------------------- */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-7xl">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid lg:grid-cols-3 gap-8"
          >
            
            {/* Why Primex - Spans 2 Columns - Pop in Effect */}
            <motion.div 
              variants={scaleIn}
              className="lg:col-span-2 bg-blue-50/50 rounded-3xl p-8 md:p-12 border border-blue-100"
            >
              <h3
                className="text-2xl md:text-3xl font-bold text-gray-900 mb-8"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {t("about.whyPrimex.title")}
              </h3>
              
              <div className="grid sm:grid-cols-2 gap-6">
                {whyPrimex.map((point, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="mt-1 w-2 h-2 rounded-full bg-[#2378FF] flex-shrink-0" />
                    <p className="text-gray-700 font-medium text-lg leading-tight">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Vision - Spans 1 Column - Pop in with Delay */}
            <motion.div
              variants={scaleIn}
              className="bg-[#2378FF] text-white rounded-3xl p-8 md:p-12 flex flex-col justify-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full" />
              
              <h3 className="text-xl font-bold mb-4 uppercase tracking-wider opacity-90">
                {t("about.visionMission.title")}
              </h3>
              <p className="text-lg md:text-xl font-medium leading-relaxed">
                &ldquo;{t("about.visionMission.description")}&rdquo;
              </p>
            </motion.div>

          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;