'use client';
import { createContext, useContext, useState, useEffect } from 'react';

type Lang = 'en' | 'fr';
const LanguageContext = createContext<{ lang: Lang; toggle: () => void }>({ lang: 'en', toggle: () => {} });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    const stored = localStorage.getItem('lang');
    if (stored === 'fr') setLang('fr');
  }, []);

  const toggle = () => setLang(l => {
    const next = l === 'en' ? 'fr' : 'en';
    localStorage.setItem('lang', next);
    return next;
  });

  return <LanguageContext.Provider value={{ lang, toggle }}>{children}</LanguageContext.Provider>;
}

export const useLang = () => useContext(LanguageContext);
