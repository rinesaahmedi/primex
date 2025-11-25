import React, { useEffect, useState } from "react";
import Certificate from "../images/certificate.png"; // Adjust path if needed

function CertificatePage() {
  const [showHero, setShowHero] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    const heroTimer = setTimeout(() => setShowHero(true), 80);
    const certificateTimer = setTimeout(() => setShowCertificate(true), 400);

    return () => {
      clearTimeout(heroTimer);
      clearTimeout(certificateTimer);
    };
  }, []);

  return (
    // Page Container: White -> Light Blue Gradient
    <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-b from-white to-[#F0F8FF] text-slate-800 overflow-x-hidden pb-16">
      {/* Header / Hero Section */}
      <div
        className={`w-full max-w-4xl mx-auto text-center pt-24 pb-12 px-6 transition-all duration-700 ease-out transform ${
          showHero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Pill */}
        <div className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider bg-sky-100 text-sky-600 mb-6">
          Verified Compliance
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 leading-tight">
          DSGVO Certificate
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
          We meet the strictest data privacy requirements to protect your
          business and your customers.
        </p>
      </div>

      {/* Content / Image Section */}
      <div
        className={`w-full flex justify-center px-6 pb-16 transition-all duration-1000 ease-out transform ${
          showCertificate
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-10 scale-95"
        }`}
      >
        <div
          className="relative w-fit mx-auto p-8 z-10"
          // We keep this specific style to shrink-wrap the image perfectly
          style={{ width: "fit-content" }}
        >
          {/* 
            Background Glows 
            Using arbitrary values for exact sizes/colors to match your design 
          */}
          <div className="absolute w-[350px] h-[350px] bg-sky-200 rounded-full blur-[80px] opacity-60 -top-10 -left-16 -z-10 animate-pulse" />
          <div className="absolute w-[400px] h-[400px] bg-indigo-200 rounded-full blur-[80px] opacity-60 -bottom-16 -right-16 -z-10 animate-pulse delay-700" />

          {/* Certificate Image */}
          <img
            src={Certificate}
            alt="DSGVO Certificate"
            className="relative block w-auto max-w-full rounded-xl bg-white shadow-2xl"
            style={{ maxHeight: "80vh" }}
          />
        </div>
      </div>
    </div>
  );
}

export default CertificatePage;
