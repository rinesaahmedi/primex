// src/components/JoinBusinessSection.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const JoinBusinessSection = () => {
  const { t } = useTranslation();

  return (
   <section
  className="
    w-full py-24 
    bg-gradient-to-r 
    from-[#FADEBC] via-[#91A6EB] to-[#2378FF]
    text-black
  "
>
  <div className="max-w-7xl mx-auto px-6 lg:px-12">

    {/* GRID WRAPPER */}
    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-20">

      {/* VERTICAL DIVIDER */}
      <div className="hidden md:block absolute inset-y-0 left-1/2 w-px bg-black/10" />

      {/* LEFT SIDE */}
      <div className="space-y-6 max-w-md">
        <p className="text-sm tracking-[0.2em] text-[#91A6EB] uppercase">
          {t('joinBusiness.joinLabel')}
        </p>

        <h2 className="text-4xl md:text-5xl font-semibold text-[#2378FF] leading-tight">
          {t('joinBusiness.joinTitle')}
        </h2>

        <p className="text-lg text-gray-700">
          {t('joinBusiness.joinDescription')}
        </p>

        <Link
          to="/apply"
          className="
            inline-block mt-4 px-8 py-3 
            rounded-full 
            bg-[#CDABFF] text-black font-medium
            hover:bg-[#b992ff]
            transition-all
          "
        >
          {t('joinBusiness.joinButton')}
        </Link>
      </div>

      {/* RIGHT SIDE */}
      <div className="space-y-6 max-w-md">
        <p className="text-sm tracking-[0.2em] text-[#91A6EB] uppercase">
          {t('joinBusiness.businessLabel')}
        </p>

        <h2 className="text-4xl md:text-5xl font-semibold text-[#2378FF] leading-tight">
          {t('joinBusiness.businessTitle')}
        </h2>

        <p className="text-lg text-gray-700">
          {t('joinBusiness.businessDescription')}
        </p>

        <Link
          to="/business"
          className="
            inline-block mt-4 px-8 py-3 
            rounded-full 
            border-2 border-[#2378FF] text-[#2378FF] font-medium
            hover:bg-[#2378FF] hover:text-white
            transition-all
          "
        >
          {t('joinBusiness.businessButton')}
        </Link>
      </div>

    </div>

  </div>
</section>

  );
};

export default JoinBusinessSection;
