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
        <div
          className="certificate-frame"
          // 👇 ADDED STYLES HERE TO SHRINK THE CONTAINER
          style={{
            width: "fit-content", // Shrinks the box to fit the image size
            margin: "0 auto", // Centers the box horizontally
            padding: "30px", // Adds nice spacing inside the box
            position: "relative", // Keeps the glow effects inside
          }}
        >
          <div className="certificate-glow certificate-glow--one" />
          <div className="certificate-glow certificate-glow--two" />
          <img
            src={Certificate}
            alt="DSGVO Certificate"
            className="certificate-image"
            // 👇 IMAGE STYLES FROM PREVIOUS STEP
            style={{
              maxHeight: "80vh", // Limits height so you don't have to scroll
              width: "auto", // Keeps the image shape correct
              maxWidth: "100%", // Ensures it fits on mobile screens
              display: "block",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default CertificatePage;
