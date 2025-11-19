// src/components/Footer.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import PrimexLogo from "../images/PRIMEX LOGO png.png";
import FacebookIcon from "../images/facebook.png";
import InstagramIcon from "../images/instagram.png";

const Footer = () => {
  const { t } = useTranslation();

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
    <footer className="bg-gray-50 text-gray-700 py-12">
      <div className="container mx-auto px-6">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company */}
          <div>
            <img src={PrimexLogo} alt={companyName} className="mb-4 w-32" />
            <p>{companyDescription}</p>
          </div>

          {/* Pages */}
          <div>
            <h4 className="text-lg font-semibold mb-3">
              {t("footer.pages.title", "Pages")}
            </h4>
            <ul className="space-y-2">
              {pageLinks.map((link, i) => (
                <li key={i}>
                  {link.url ? (
                    link.external ? (
                      <a href={link.url}>{link.name}</a>
                    ) : (
                      <Link to={link.url}>{link.name}</Link>
                    )
                  ) : (
                    <span>{link.name}</span> // Display text if URL is empty
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h4 className="text-lg font-semibold mb-3">
              {t("footer.hours.title", "Working Hours")}
            </h4>
            <ul className="space-y-1">
              {hours.map((time, i) => (
                <li key={i}>{time}</li>
              ))}
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-3">{socialTitle}</h4>
            <div className="flex space-x-4 mb-4">
              <a
                href="https://www.facebook.com/primexeu"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={FacebookIcon} alt="Facebook" className="w-6 h-6" />
              </a>
              <a
                href="https://www.instagram.com/primex.eu/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={InstagramIcon} alt="Instagram" className="w-6 h-6" />
              </a>
            </div>
            <h4 className="text-lg font-semibold mb-1">{contactTitle}</h4>
            <p>{contactEmail}</p>
            <p>{contactPhone}</p>
            <p className="mt-2">
              <a
                href="https://maps.app.goo.gl/1AvD5MdteLP1Zy5n8"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2378FF] hover:text-[#1f5fcc] hover:underline transition-colors"
              >
                {contactLocation}
              </a>
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t pt-4 text-center text-sm text-gray-500">
          &copy; 2025 PrimEx. {copyright}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
