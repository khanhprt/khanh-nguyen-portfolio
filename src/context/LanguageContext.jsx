import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { languages, messages } from '../data/translations';

const LanguageContext = createContext(null);

function initialLanguage() {
  const query = new URLSearchParams(window.location.search).get('lang');
  if (query in languages) return query;
  try {
    const saved = localStorage.getItem('khanh-nguyen-lang');
    if (saved in languages) return saved;
  } catch { /* Storage may be unavailable in private browsing. */ }
  return 'vi';
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(initialLanguage);
  useEffect(() => {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : language;
    document.title = messages[language]['meta.title'] || messages.vi['meta.title'];
    document.querySelector('meta[name="description"]').content = messages[language]['meta.desc'];
    try { localStorage.setItem('khanh-nguyen-lang', language); } catch { /* Optional persistence. */ }
  }, [language]);
  const value = useMemo(() => ({
    language,
    setLanguage,
    t: (key, variables = {}) => (messages[language][key] ?? messages.vi[key] ?? key)
      .replace(/\{(\w+)\}/g, (_, name) => variables[name] ?? ''),
    pick: (value) => value && typeof value === 'object'
      ? value[language] ?? value.vi ?? value.en ?? '' : value ?? '',
  }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
}
