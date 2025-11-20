// src/components/Footer.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";

import PrimexLogo from "../images/PRIMEX LOGO png.png";
import FacebookIcon from "../images/facebook.png";
import InstagramIcon from "../images/instagram.png";

const LinkedInIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-white"
  >
    <path d="M20.451 20.451h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.448-2.136 2.941v5.665H9.354V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.368-1.85 3.6 0 4.267 2.37 4.267 5.456v6.284zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.114 20.451H3.559V9h3.555v11.451zM22.225 0H1.771C.792 0 0 .771 0 1.723v20.554C0 23.229.792 24 1.771 24h20.451C23.2 24 24 23.229 24 22.277V1.723C24 .771 23.2 0 22.225 0z" />
  </svg>
);

const Footer = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  /** -----------------------------
   * Smooth scroll for hash links
   * ----------------------------*/
  const handleHashNavigation = (e, hash) => {
    e.preventDefault();

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => scrollToHash(hash), 150);
    } else {
      scrollToHash(hash);
    }
  };

  const scrollToHash = (hash) => {
    const el = document.querySelector(hash);
    if (!el) return;

    const headerOffset = 80;
    const elementPos = el.getBoundingClientRect().top + window.scrollY;
    const offsetPos = elementPos - headerOffset;

    window.scrollTo({ top: offsetPos, behavior: "smooth" });
  };

  /** -----------------------------
   * Translation Data
   * ----------------------------*/
  const companyName = t("footer.company.name", "PrimEx");
  const companyDescription = t("footer.company.description", "");
  const pageLinks = t("footer.pages.links", { returnObjects: true }) || [];

  const hours = t("footer.hours.times", { returnObjects: true }) || [];
  const contactTitle = t("footer.contact.title", "Contact Us");
  const contactEmail = t("footer.contact.email", "info@primexeu.com");
  const contactPhone = t("footer.contact.phone", "+383 49 937 863");
  const contactLocation = t("footer.contact.location", "7 Shtatori, Fushë Kosovë 12010");
  const socialTitle = t("footer.social.title", "Follow Us On");
  const copyright = t("footer.copyright", "");

  /** -----------------------------
   * Hash Sections on Home Page
   * ----------------------------*/
  const hashSections = {
    "Home": "#",
    "About Us": "#about",
    "Services": "#services",
    "Our Partners": "#partners",
    "Contact Us": "#contact"
  };

  return (
    <footer className="bg-gradient-to-br from-[#081333] via-[#123a78] to-[#081333] text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        
        {/* ================= TOP GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* -------- COMPANY -------- */}
          <div>
            <img
              src={PrimexLogo}
              alt="PrimEx"
              className="mb-6 w-40 brightness-0 invert"
            />
            <p className="text-slate-300 leading-relaxed">
              {companyDescription}
            </p>
          </div>

          {/* -------- PAGES -------- */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Pages</h4>
            <ul className="space-y-3">

              {pageLinks.map((link, i) => {
                const isHash = !link.url;
                const hash = hashSections[link.name] || "#";

                // 🌐 External URLs
                if (link.external) {
                  return (
                    <li key={i}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-300 hover:text-[#2378FF] transition"
                      >
                        {link.name}
                      </a>
                    </li>
                  );
                }

                // 🔗 Hash-based internal navigation (Home sections)
                if (isHash) {
                  return (
                    <li key={i}>
                      <a
                        href={hash}
                        onClick={(e) => handleHashNavigation(e, hash)}
                        className="text-slate-300 hover:text-[#2378FF] transition cursor-pointer"
                      >
                        {link.name}
                      </a>
                    </li>
                  );
                }

                // 🛣 Normal React Router links
                return (
                  <li key={i}>
                    <Link
                      to={link.url}
                      className="text-slate-300 hover:text-[#2378FF] transition"
                    >
                      {link.name}
                    </Link>
                  </li>
                );
              })}

            </ul>
          </div>

          {/* -------- WORKING HOURS -------- */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Working Hours</h4>
            <ul className="space-y-2">
              {hours.map((time, i) => (
                <li key={i} className="text-slate-300">{time}</li>
              ))}
            </ul>
          </div>

          {/* -------- CONTACT -------- */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{contactTitle}</h4>

            <div className="space-y-3">
              <a
                href={`mailto:${contactEmail.replace("E-mail: ", "").replace("E-Mail: ", "")}`}
                className="text-slate-300 hover:text-[#2378FF] transition"
              >
                {contactEmail}
              </a>

              <a
                href={`tel:${contactPhone.replace("Phone: ", "").replace("Telefon: ", "").replace(/\s/g, "")}`}
                className="text-slate-300 hover:text-[#2378FF] transition"
              >
                {contactPhone}
              </a>

              <a
                href="https://maps.app.goo.gl/1AvD5MdteLP1Zy5n8"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2378FF] hover:underline"
              >
                {contactLocation}
              </a>
            </div>

            {/* -------- SOCIAL -------- */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-4">{socialTitle}</h4>
              <div className="flex space-x-4">
                <a
                  href="https://www.facebook.com/primexeu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/10 hover:bg-[#2378FF] flex items-center justify-center transition"
                >
                  <img src={FacebookIcon} alt="Facebook" className="w-5 h-5 brightness-0 invert" />
                </a>

                <a
                  href="https://www.instagram.com/primex.eu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/10 hover:bg-[#2378FF] flex items-center justify-center transition"
                >
                  <img src={InstagramIcon} alt="Instagram" className="w-5 h-5 brightness-0 invert" />
                </a>
                <a
                  href="https://www.linkedin.com/company/primexeu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/10 hover:bg-[#2378FF] flex items-center justify-center transition-all"
                >
                  <LinkedInIcon />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* ================= BOTTOM ================= */}
        <div className="border-t border-slate-700 pt-8 text-center">
          <p className="text-slate-400 text-sm">
            © 2025 PrimEx. {copyright}
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
