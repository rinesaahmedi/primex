import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enBase from "./locales/en/translation.json";
import deBase from "./locales/de/translation.json";

import enAiAgents from "./locales/en/services/aiAgents.json";
import enSoftwareDeveloper from "./locales/en/services/softwareDeveloper.json";
import enGraphicDesigner from "./locales/en/services/graphicDesigner.json";
import enCustomerSupport from "./locales/en/services/customerSupport.json";
import enOperationalService from "./locales/en/services/operationalService.json";
import enECommerce from "./locales/en/services/eCommerce.json";

import deAiAgents from "./locales/de/services/aiAgents.json";
import deSoftwareDeveloper from "./locales/de/services/softwareDeveloper.json";
import deGraphicDesigner from "./locales/de/services/graphicDesigner.json";
import deCustomerSupport from "./locales/de/services/customerSupport.json";
import deOperationalService from "./locales/de/services/operationalService.json";
import deECommerce from "./locales/de/services/eCommerce.json";

const mergeDeep = (target, source) => {
  const output = Array.isArray(target) ? [...target] : { ...target };

  if (typeof source !== "object" || source === null) {
    return output;
  }

  Object.keys(source).forEach((key) => {
    const sourceValue = source[key];
    if (
      sourceValue &&
      typeof sourceValue === "object" &&
      !Array.isArray(sourceValue)
    ) {
      const targetValue =
        output[key] && typeof output[key] === "object" && !Array.isArray(output[key])
          ? output[key]
          : {};
      output[key] = mergeDeep(targetValue, sourceValue);
    } else {
      output[key] = sourceValue;
    }
  });

  return output;
};

const buildTranslation = (...parts) =>
  parts.reduce((acc, part) => mergeDeep(acc, part), {});

const en = buildTranslation(
  enBase,
  enAiAgents,
  enSoftwareDeveloper,
  enGraphicDesigner,
  enCustomerSupport,
  enOperationalService,
  enECommerce
);

const de = buildTranslation(
  deBase,
  deAiAgents,
  deSoftwareDeveloper,
  deGraphicDesigner,
  deCustomerSupport,
  deOperationalService,
  deECommerce
);

const savedLng =
  typeof window !== "undefined" ? localStorage.getItem("i18nextLng") : null;

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    de: { translation: de },
  },
  lng: savedLng || "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
