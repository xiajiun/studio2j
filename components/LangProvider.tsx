'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { translations, type Lang, type T } from '@/lib/i18n'

interface LangCtx { lang: Lang; setLang: (l: Lang) => void; t: T }

const Ctx = createContext<LangCtx>({ lang: 'en', setLang: () => {}, t: translations.en })

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')

  useEffect(() => {
    const saved = localStorage.getItem('s2j-lang') as Lang | null
    if (saved && translations[saved]) setLangState(saved)
  }, [])

  function setLang(l: Lang) {
    setLangState(l)
    localStorage.setItem('s2j-lang', l)
  }

  return (
    <Ctx.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </Ctx.Provider>
  )
}

export function useLang() { return useContext(Ctx) }
