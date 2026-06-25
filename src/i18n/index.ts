import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { resources } from "./resources";

i18n.use(initReactI18next).init({
  resources: resources,
  lng: "hi", // default language
  fallbackLng: "hi", // fallback language if the current language is not available
  interpolation: {
    escapeValue: false // react already safes from xss
  }
});

export default i18n;