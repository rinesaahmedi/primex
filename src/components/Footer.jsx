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

  // Handle smooth scroll navigation for hash links
  const handleLinkClick = (e, href) => {
    if (href && href.startsWith('#')) {
      e.preventDefault();
      
      // If we're not on the home page, navigate first then scroll
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const element = document.querySelector(href);
          if (element) {
            const headerOffset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
          }
        }, 100);
        return;
      }
      
      const element = document.querySelector(href);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
  };

  // Fetch all translation objects safely
  const companyName = t("footer.company.name", "PrimEx");
  const companyDescription = t(
    "footer.company.description",
    "Prime Team, Prime Solution..."
  );
  const pageLinks = t("footer.pages.links", { returnObjects: true }) || [];
  const hours = t("footer.hours.times", { returnObjects: true }) || [];
  const socialTitle = t("footer.social.title", "Follow Us");
  const contactTitle = t("footer.contact.title", "Contact Us");
  const contactEmail = t("footer.contact.email", "info@primexeu.com");
  const contactPhone = t("footer.contact.phone", "+383 49 937 863");
  const contactLocation = t("footer.contact.location", "7 Shtatori, Fushë Kosovë 12010");
  const copyright = t("footer.copyright", "All rights reserved.");

  return (
    <footer className="bg-gradient-to-br from-[#081333] via-[#123a78] to-[#081333] text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company */}
          <div className="lg:col-span-1">
            <img src={PrimexLogo} alt={companyName} className="mb-6 w-36 brightness-0 invert" />
            <p className="text-slate-300 leading-relaxed">{companyDescription}</p>
          </div>

          {/* Pages */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">
              {t("footer.pages.title", "Pages")}
            </h4>
            <ul className="space-y-3">
              {pageLinks.map((link, i) => {
                // Map link names to their hash IDs
                const hashMap = {
                  "Home": "#",
                  "About Us": "#about",
                  "Services": "#services",
                  "Our Partners": "#partners",
                  "Contact Us": "#contact",
                };
                
                const hashId = hashMap[link.name] || `#${link.name.toLowerCase().replace(/\s+/g, '')}`;
                const isHashLink = !link.url || hashId.startsWith('#');
                
                return (
                  <li key={i}>
                    {link.url && !isHashLink ? (
                      link.external ? (
                        <a 
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-300 hover:text-[#2378FF] transition-colors"
                        >
                          {link.name}
                        </a>
                      ) : (
                        <Link 
                          to={link.url}
                          className="text-slate-300 hover:text-[#2378FF] transition-colors"
                        >
                          {link.name}
                        </Link>
                      )
                    ) : (
                      <a
                        href={hashId === "#" ? "/" : hashId}
                        onClick={(e) => {
                          if (hashId !== "#") {
                            handleLinkClick(e, hashId);
                          } else {
                            e.preventDefault();
                            window.location.href = "/";
                          }
                        }}
                        className="text-slate-300 hover:text-[#2378FF] transition-colors cursor-pointer"
                      >
                        {link.name}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">
              {t("footer.hours.title", "Working Hours")}
            </h4>
            <ul className="space-y-2">
              {hours.map((time, i) => (
                <li key={i} className="text-slate-300">{time}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">{contactTitle}</h4>
            <div className="space-y-3">
              <p className="text-slate-300">
                <a 
                  href={`mailto:${contactEmail.replace(/^E-mail:\s*/i, '').replace(/^E-Mail:\s*/i, '')}`}
                  className="hover:text-[#2378FF] transition-colors"
                >
                  {contactEmail}
                </a>
              </p>
              <p className="text-slate-300">
                <a 
                  href={`tel:${contactPhone.replace(/^Phone:\s*/i, '').replace(/^Telefon:\s*/i, '').replace(/\s/g, '')}`}
                  className="hover:text-[#2378FF] transition-colors"
                >
                  {contactPhone}
                </a>
              </p>
              <p className="text-slate-300">
                <a
                  href="https://maps.app.goo.gl/1AvD5MdteLP1Zy5n8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2378FF] hover:text-[#1f5fcc] hover:underline transition-colors inline-block"
                >
                  {contactLocation}
                </a>
              </p>
            </div>
            
            {/* Social */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-4 text-white">{socialTitle}</h4>
              <div className="flex space-x-4">
                <a
                  href="https://www.facebook.com/primexeu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/10 hover:bg-[#2378FF] flex items-center justify-center transition-all"
                >
                  <img src={FacebookIcon} alt="Facebook" className="w-5 h-5 brightness-0 invert" />
                </a>
                <a
                  href="https://www.instagram.com/primex.eu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/10 hover:bg-[#2378FF] flex items-center justify-center transition-all"
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

        {/* Bottom */}
        <div className="border-t border-slate-700 pt-8 text-center">
          <p className="text-slate-400 text-sm">
            &copy; 2025 PrimEx. {copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
