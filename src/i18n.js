import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      "dashboard": "Dashboard",
      "patients": "Patients",
      "appointments": "Appointments",
      "doctors": "Doctors",
      "prescriptions": "Prescriptions",
      "billing": "Billing",
      "inventory": "Inventory",
      "welcome": "Welcome back",
      "search": "Search...",
      "logout": "Logout",
    }
  },
  hi: {
    translation: {
      "dashboard": "डैशबोर्ड",
      "patients": "मरीज",
      "appointments": "नियुक्तियां",
      "doctors": "डॉक्टर",
      "prescriptions": "नुस्खे",
      "billing": "बिलिंग",
      "inventory": "माल-सूची",
      "welcome": "वापसी पर स्वागत है",
      "search": "खोजें...",
      "logout": "लॉग आउट",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem("language") || "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
