import React from "react";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div style={{ padding: 24 }}>
      <h1>{t("welcome")}</h1>
      <p>{t("intro")}</p>
    </div>
  );
}
