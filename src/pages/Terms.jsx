// src/components/Terms.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const Terms = () => {
  const { t, i18n } = useTranslation();
  const [termsText, setTermsText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHero, setShowHero] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const locale = useMemo(() => {
    const lang = i18n.language || "en";
    if (lang.toLowerCase().startsWith("de")) {
      return "de";
    }
    return "en";
  }, [i18n.language]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/terms-${locale}.txt`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load terms file");
        }
        return response.text();
      })
      .then((data) => {
        setTermsText(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [locale]);

  useEffect(() => {
    const heroTimer = setTimeout(() => setShowHero(true), 80);
    const contentTimer = setTimeout(() => setShowContent(true), 380);

    return () => {
      clearTimeout(heroTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  const renderBody = () => {
    if (loading) {
      return (
        <p className="terms-message text-slate-500">
          {t("termsPage.loading")}
        </p>
      );
    }

    if (error) {
      return (
        <p className="terms-message text-red-600">
          {t("termsPage.error", { message: error })}
        </p>
      );
    }

    return <pre className="terms-body">{termsText}</pre>;
  };

  return (
    <div className="certificate-page">
      <div className={`certificate-hero ${showHero ? "visible" : ""}`}>
        <p className="certificate-pill">{t("termsPage.pill")}</p>
        <h1 className="certificate-title">{t("termsPage.title")}</h1>
        <p className="certificate-subtitle">{t("termsPage.subtitle")}</p>
      </div>

      <div className={`certificate-view ${showContent ? "visible" : ""}`}>
        <div className="certificate-frame">
          <div className="terms-meta">
            <span>{t("termsPage.meta.updated")}</span>
            <span>{t("termsPage.meta.jurisdiction")}</span>
          </div>
          {renderBody()}
        </div>
      </div>
    </div>
  );
};

export default Terms;
