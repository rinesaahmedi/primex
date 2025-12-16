// src/components/Footer.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";

import PrimexLogo from "../assets/primex-logo-white.png";
import FacebookIcon from "../images/facebook.png";
import InstagramIcon from "../images/instagram.png";

const LinkedInIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
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

  const handleHashNavigation = (e, hash) => {
    e.preventDefault();
    const destination = hash || "#";
    const scrollToTarget = () => {
      if (destination === "#" || destination === "#top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const element = document.querySelector(destination);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }
    };
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(scrollToTarget, 150);
    } else {
      scrollToTarget();
    }
  };

  const companyDescription = t("footer.company.description");
  const pageLinks = t("footer.pages.links", { returnObjects: true }) || [];
  const hours = t("footer.hours.times", { returnObjects: true }) || [];

  const contactTitle = t("footer.contact.title");
  const contactEmail = t("footer.contact.email");
  const contactPhone = t("footer.contact.phone");
  const contactLocation = t("footer.contact.location");
  const contactLocationEU = t("footer.contactEU.location"); // Ensure this key exists in JSON

  const copyright = t("footer.copyright");

  return (
    <footer className="bg-gradient-to-br from-[#081333] via-[#123a78] to-[#081333] text-white text-sm">
      {/* Reduced py-16 to py-10 for less height */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* ================= TOP GRID ================= */}
        {/* Reduced gap-12 to gap-8, mb-12 to mb-8 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* -------- COL 1: COMPANY -------- */}
          <div>
            <img
              src={PrimexLogo}
              alt="PrimEx"
              className="mb-4 w-32 brightness-0 invert"
            />
            <p className="text-slate-300 leading-relaxed max-w-xs">
              {companyDescription}
            </p>
          </div>

          {/* -------- COL 2: PAGES -------- */}
          <div>
            <h4 className="text-base font-semibold mb-3 text-white uppercase tracking-wide">
              {t("footer.pages.title")}
            </h4>
            <ul className="space-y-2">
              {pageLinks.map((link, i) => {
                const key = `${link.name}-${i}`;
                const classes =
                  "text-slate-300 hover:text-[#2378FF] transition inline-block";

                if (link.external && link.url) {
                  return (
                    <li key={key}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={classes}
                      >
                        {link.name}
                      </a>
                    </li>
                  );
                }
                if (link.hash) {
                  return (
                    <li key={key}>
                      <a
                        href={link.hash}
                        onClick={(e) => handleHashNavigation(e, link.hash)}
                        className={`${classes} cursor-pointer`}
                      >
                        {link.name}
                      </a>
                    </li>
                  );
                }
                if (link.url) {
                  return (
                    <li key={key}>
                      <Link to={link.url} className={classes}>
                        {link.name}
                      </Link>
                    </li>
                  );
                }
                return null;
              })}
            </ul>
          </div>

          {/* -------- COL 3: WORKING HOURS -------- */}
          <div>
            <h4 className="text-base font-semibold mb-3 text-white uppercase tracking-wide">
              {t("footer.hours.title")}
            </h4>
            <ul className="space-y-2">
              {hours.map((time, i) => (
                <li key={i} className="text-slate-300">
                  {time}
                </li>
              ))}
            </ul>
          </div>

          {/* -------- COL 4: CONTACT (Merged & Compact) -------- */}
          <div>
            {/* Kosovo */}
            <div className="mb-6">
              <h4 className="text-base font-semibold mb-3 text-white uppercase tracking-wide">
                {contactTitle}
              </h4>
              <div className="flex flex-col gap-1.5">
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-slate-300 hover:text-[#2378FF] transition"
                >
                  {contactEmail}
                </a>
                <a
                  href={`tel:${contactPhone.replace(/\s/g, "")}`}
                  className="text-slate-300 hover:text-[#2378FF] transition"
                >
                  {contactPhone}
                </a>
                <a
                  href="https://maps.app.goo.gl/1AvD5MdteLP1Zy5n8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-[#2378FF] transition"
                >
                  {contactLocation}
                </a>
              </div>
            </div>

            {/* EU */}
            <div>
              <h4 className="text-base font-semibold mb-2 text-white uppercase tracking-wide">
                {t("footer.contactEU.title", "Contact EU")}
              </h4>
              <div className="flex flex-col gap-1 text-slate-300">
                <a
                  href="mailto:info@mendex.ai"
                  className="text-slate-300 hover:text-[#2378FF] transition"
                >
                  info@mendex.ai
                </a>
                {/* Cleaned up Address Block */}
                <a
                  href="https://maps.app.goo.gl/MGjLPUpX3i8kUUUH6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#2378FF] transition leading-snug mt-1"
                >
                  <span className="block">{contactLocationEU}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ================= BOTTOM BAR (Copyright + Socials) ================= */}
        {/* Reduced pt-8 to pt-6 */}
        <div className="border-t border-slate-600 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-xs">© 2025 PrimEx. {copyright}</p>

          {/* Social Icons Moved Here to save vertical space above */}
          <div className="flex space-x-3">
            <a
              href="https://www.facebook.com/primexeu"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded bg-white/10 hover:bg-[#2378FF] flex items-center justify-center transition"
            >
              <img
                src={FacebookIcon}
                alt="Facebook"
                className="w-4 h-4 brightness-0 invert"
              />
            </a>

            <a
              href="https://www.instagram.com/primex.eu/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded bg-white/10 hover:bg-[#2378FF] flex items-center justify-center transition"
            >
              <img
                src={InstagramIcon}
                alt="Instagram"
                className="w-4 h-4 brightness-0 invert"
              />
            </a>
            <a
              href="https://www.linkedin.com/company/primexeu/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded bg-white/10 hover:bg-[#2378FF] flex items-center justify-center transition"
            >
              <LinkedInIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
