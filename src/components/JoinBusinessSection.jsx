// src/components/JoinBusinessSection.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const JoinBusinessSection = () => {
  const { t } = useTranslation();

  return (
  <section className="w-full py-24 
    bg-gradient-to-r 
    from-[#FADEBC] via-[#91A6EB] to-[#2378FF]
    text-[#1a1a1a]  /* dark grey text */
">
  <div className="max-w-7xl mx-auto px-6 lg:px-12">

    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-20">

      {/* VERTICAL DIVIDER */}
      <div className="hidden md:block absolute inset-y-0 left-1/2 w-px bg-[#2378FF]/30"></div>

      {/* LEFT SIDE */}
      <div className="space-y-6 max-w-md">

        <p className="text-sm tracking-wide text-[#2378FF] uppercase">
          {t("joinBusiness.joinLabel")}
        </p>

        <h2 className="text-4xl md:text-5xl font-semibold text-[#2378FF] leading-tight">
          {t("joinBusiness.joinTitle")}
        </h2>

        <p className="text-lg text-[#1a1a1a]/80">
          {t("joinBusiness.joinDescription")}
        </p>

        <Link
          to="/apply"
          className="
            inline-block mt-4 px-8 py-3 
            bg-[#CDABFF] text-[#000] font-medium 
            rounded-full hover:bg-[#b68bff] transition-all
          "
        >
          {t("joinBusiness.joinButton")}
        </Link>
      </div>

      {/* RIGHT SIDE */}
      <div className="space-y-6 max-w-md">

        <p className="text-sm tracking-wide text-[#2378FF] uppercase">
          {t("joinBusiness.businessLabel")}
        </p>

        <h2 className="text-4xl md:text-5xl font-semibold text-[#2378FF] leading-tight">
          {t("joinBusiness.businessTitle")}
        </h2>

        <p className="text-lg text-[#1a1a1a]/80">
          {t("joinBusiness.businessDescription")}
        </p>

        <Link
          to="/business"
          className="
            inline-block mt-4 px-8 py-3 
            border-2 border-[#2378FF] text-[#2378FF] 
            rounded-full hover:bg-[#2378FF] hover:text-white transition-all
          "
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
