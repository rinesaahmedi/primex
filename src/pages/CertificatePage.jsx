import React from "react";
import Certificate from "../images/certificate.png"; // Adjust the path if needed

function CertificatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1d3c6a] to-white">
      {/* Header Section: Darker Blue */}
      <div className="bg-[#1d3c6a] text-white py-24">
        <h1 className="text-4xl font-semibold text-center mb-16">
          DSGVO Certificate
        </h1>
      </div>

      {/* Content Section with White Background */}
      <div className="flex flex-col items-center justify-start bg-white py-16 px-4 sm:px-6 lg:px-8">
        <img
          src={Certificate}
          alt="DSGVO Certificate"
          className="w-full max-w-3xl rounded-xl shadow-lg transform transition duration-300 ease-in-out hover:scale-105 mt-16"
        />
      </div>
    </div>
  );
}

export default CertificatePage;
