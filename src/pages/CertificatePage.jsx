import React, { useEffect, useState } from "react";
import Certificate from "../images/certificate.png"; // Adjust the path if needed

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
    <div className="certificate-page">
      {/* Header Section */}
      <div className={`certificate-hero ${showHero ? "visible" : ""}`}>
        <p className="certificate-pill">Verified Compliance</p>
        <h1 className="certificate-title">DSGVO Certificate</h1>
        <p className="certificate-subtitle">
          We meet the strictest data privacy requirements to protect your
          business and your customers.
        </p>
      </div>

      {/* Content Section */}
      <div className={`certificate-view ${showCertificate ? "visible" : ""}`}>
        <div className="certificate-frame">
          <div className="certificate-glow certificate-glow--one" />
          <div className="certificate-glow certificate-glow--two" />
          <img
            src={Certificate}
            alt="DSGVO Certificate"
            className="certificate-image"
          />
        </div>
      </div>
    </div>
  );
}

export default CertificatePage;
