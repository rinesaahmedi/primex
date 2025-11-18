// src/components/Hero.jsx
import React from "react";
import { useTranslation } from "react-i18next";

const Hero = ({ darkMode }) => {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-600 to-dark-blue-900 text-white h-screen">
      <div className="flex flex-col items-center space-y-6 text-center px-6">
        <h1 className="text-5xl font-extrabold leading-tight">{t("welcome")}</h1>
        <p className="text-xl max-w-2xl">{t("intro")}</p>

        {/* Buttons */}
        <div className="flex flex-col space-y-4 mt-8">
          <button className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition">
            Get in Touch
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
