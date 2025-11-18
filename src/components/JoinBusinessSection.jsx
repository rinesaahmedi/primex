// src/components/JoinBusinessSection.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const JoinBusinessSection = () => {
  const { t } = useTranslation();

  return (
    <section className="w-full py-24 bg-gradient-to-r from-[#020617] to-[#0b1b3a] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* GRID WRAPPER */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-20">

          {/* VERTICAL DIVIDER */}
          <div className="hidden md:block absolute inset-y-0 left-1/2 w-px bg-white/20"></div>

          {/* LEFT SIDE */}
          <div className="space-y-6 max-w-md">
            <p className="text-sm tracking-wide text-gray-300">
              {t("joinBusiness.joinLabel")}
            </p>

            <h2 className="text-4xl md:text-5xl font-semibold leading-tight">
              {t("joinBusiness.joinTitle")}
            </h2>

            <p className="text-gray-400 text-lg">
              {t("joinBusiness.joinDescription")}
            </p>

            <Link
              to="/apply"
              className="inline-block mt-4 px-8 py-3 bg-lime-300 text-black font-medium rounded-full hover:bg-lime-400 transition-all"
            >
              {t("joinBusiness.joinButton")}
            </Link>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6 max-w-md">
            <p className="text-sm tracking-wide text-gray-300">
              {t("joinBusiness.businessLabel")}
            </p>

            <h2 className="text-4xl md:text-5xl font-semibold leading-tight">
              {t("joinBusiness.businessTitle")}
            </h2>

            <p className="text-gray-400 text-lg">
              {t("joinBusiness.businessDescription")}
            </p>

            <Link
              to="/business"
              className="inline-block mt-4 px-8 py-3 border border-lime-300 text-lime-300 rounded-full hover:bg-lime-300 hover:text-black transition-all"
            >
              {t("joinBusiness.businessButton")}
            </Link>
          </div>

        </div>
        
      </div>
    </section>
  );
};

export default JoinBusinessSection;
