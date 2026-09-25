import { createContext, useContext, useEffect, useState } from "react";
import { contentData } from "../data/content";

const LanguageContext = createContext({
  lang: "en",
  setLang: () => {},
  content: contentData.en,
});

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("portfolio-lang");
      if (savedLang && (savedLang === "en" || savedLang === "az")) {
        return savedLang;
      }
    }
    return "en";
  });

  useEffect(() => {
    localStorage.setItem("portfolio-lang", lang);
  }, [lang]);

  const setLang = (newLang) => {
    if (newLang === "en" || newLang === "az") {
      setLangState(newLang);
    }
  };

  const content = contentData[lang] || contentData.en;

  return (
    <LanguageContext.Provider value={{ lang, setLang, content }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
