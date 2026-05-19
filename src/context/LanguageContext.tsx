"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, LanguageCode, languages } from "@/lib/translations";

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => any;
  currentLanguageName: string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");

  useEffect(() => {
    const initLang = () => {
      try {
        const savedLang = localStorage.getItem("sahaychain_lang") as LanguageCode;
        if (savedLang && translations[savedLang]) {
          setLanguageState(savedLang);
        }
      } catch (e) {
        console.error("Language initialization failed:", e);
      }
    };
    initLang();
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem("sahaychain_lang", lang);
  };

  const t = (path: string) => {
    const keys = path.split(".");
    let result = translations[language];
    for (const key of keys) {
      if (result && result[key]) {
        result = result[key];
      } else {
        // Fallback to English if key missing
        let fallback = translations["en"];
        for (const fKey of keys) {
          if (fallback && fallback[fKey]) {
            fallback = fallback[fKey];
          } else {
            return path; // Return key if totally missing
          }
        }
        return fallback;
      }
    }
    return result;
  };

  const currentLanguageName = languages.find(l => l.code === language)?.nativeName || "English";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, currentLanguageName }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
