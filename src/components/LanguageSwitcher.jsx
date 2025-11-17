import React from "react";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (e) => {
    const lng = e.target.value;
    i18n.changeLanguage(lng);
    try {
      localStorage.setItem("i18nextLng", lng);
    } catch (err) {
      // ignore (e.g., storage disabled)
    }
  };

  return (
    <select
      value={i18n.language || "en"}
      onChange={changeLanguage}
      aria-label="Select language"
      style={{ marginLeft: 12 }}
    >
      <option value="en">English</option>
      <option value="de">Deutsch</option>
    </select>
  );
}
