// src/pages/Home.jsx
import React from "react";
import Hero from "../components/Hero.jsx";
import About from "../components/About.jsx";
import Services from "../components/Services.jsx";
import PartnersGrid from "../components/PartnersGrid.jsx";
import JoinBusinessSection from "../components/JoinBusinessSection.jsx";
import PartnerTestimonials from "../components/PartnerTestimonials.jsx";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <PartnersGrid />
      <JoinBusinessSection />
      <PartnerTestimonials />
    </>
  );
}
