// src/components/JoinBusinessSection.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useScrollAnimation } from "../utils/useScrollAnimation";

const JoinBusinessSection = () => {
  const { t } = useTranslation();
  const [sectionRef, isVisible] = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      id="contact"
      className="w-full py-24 
    bg-gradient-to-br 
    from-[#081333] via-[#1659bd] to-[#fadebc]
    text-white
  "
    >
      <div ref={sectionRef} className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-20">
          {/* VERTICAL DIVIDER */}
          <div className="hidden md:block absolute inset-y-0 left-1/2 w-px bg-white/30"></div>

          {/* LEFT SIDE */}
          <div
            className={`space-y-6 max-w-md animate-lift-blur-subtle ${
              isVisible ? "visible" : ""
            }`}
          >
            <p className="text-sm tracking-wide text-white/80 uppercase font-semibold">
              {t("joinBusiness.joinLabel")}
            </p>

            <h2 className="text-4xl md:text-5xl font-semibold text-white leading-tight">
              {t("joinBusiness.joinTitle")}
            </h2>

            <p className="text-lg text-white/90">
              {t("joinBusiness.joinDescription")}
            </p>

            <Link
              to="/apply"
              className="
            inline-block mt-4 px-8 py-3 
            bg-white text-[#2378FF] font-semibold
            rounded-xl hover:bg-white/90 transition-all
            shadow-lg hover:shadow-xl
          "
            >
              {t("joinBusiness.joinButton")}
            </Link>
          </div>

          {/* RIGHT SIDE */}
          <div
            className={`space-y-6 max-w-md animate-lift-blur-subtle  lg:pl-10 ${
              isVisible ? "visible" : ""
            }`}
            style={{ transitionDelay: "0.2s" }}
          >
            <p className="text-sm tracking-wide text-white/80 uppercase font-semibold">
              {t("joinBusiness.businessLabel")}
            </p>

            <h2 className="text-4xl md:text-5xl font-semibold text-white leading-tight">
              {t("joinBusiness.businessTitle")}
            </h2>

            <p className="text-lg text-white/90">
              {t("joinBusiness.businessDescription")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              {/* 1. Existing Business Button (Outlined - Secondary Action) */}
              <Link
                to="/business"
                className="
                  px-8 py-3 text-center
                  border-2 border-white text-white font-semibold
                  rounded-xl hover:bg-white hover:text-[#2378FF] transition-all
                "
              >
                {t("joinBusiness.businessButton")}
              </Link>
              {/* 2. New Appointment Button (Filled White - Primary Action) */}
              <Link
                to="/appointments"
                className="
                  px-8 py-3 text-center
                  bg-white text-[#2378FF] font-semibold
                  rounded-xl hover:bg-white/90 transition-all
                  shadow-lg
                "
              >
                {/* Ensure you add this key to your translation file, or change text here */}
                {t("joinBusiness.appointmentButton") || "Book Appointment"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinBusinessSection;
