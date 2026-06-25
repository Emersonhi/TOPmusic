'use client';
import { createContext, useContext, useState } from 'react';

type Lang = 'en' | 'fr';
const LanguageContext = createContext<{ lang: Lang; toggle: () => void }>({ lang: 'en', toggle: () => {} });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  const toggle = () => setLang(l => (l === 'en' ? 'fr' : 'en'));
  return <LanguageContext.Provider value={{ lang, toggle }}>{children}</LanguageContext.Provider>;
}

export const useLang = () => useContext(LanguageContext);
