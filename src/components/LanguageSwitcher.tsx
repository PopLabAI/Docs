'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon'
import { Locale } from '@/lib/translations'
import { motion } from 'framer-motion'

const languages = [
  { code: 'en' as Locale, name: 'English', shortName: 'EN'},
  { code: 'zh-CN' as Locale, name: '简体中文', shortName: '简中'},
  { code: 'ja-JP' as Locale, name: '日本語', shortName: '日語'},
]

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  
  const currentLocale = languages.find(lang => 
    pathname.startsWith(`/${lang.code}`)
  )?.code || 'en'
  
  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0]
  
  const handleLanguageChange = (newLocale: Locale) => {
    let newPath = pathname
    
    for (const lang of languages) {
      if (pathname.startsWith(`/${lang.code}`)) {
        newPath = pathname.replace(`/${lang.code}`, '')
        break
      }
    }
    
    if (newLocale === 'en') {
      newPath = newPath || '/'
    } else {
      newPath = `/${newLocale}${newPath}`
    }
    
    router.push(newPath)
    setIsOpen(false)
  }
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden h-8 w-full items-center gap-2 rounded-full bg-white px-3 text-xs text-zinc-500 ring-1 ring-zinc-900/10 transition hover:ring-zinc-900/20 sm:flex dark:bg-white/5 dark:text-zinc-400 dark:ring-white/10 dark:ring-inset dark:hover:ring-white/20"
      >
        <span>{currentLanguage.name}</span>
        <ChevronDownIcon className="h-4 w-4" />
      </button>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-8 w-full items-center gap-1 text-sm sm:hidden rounded-md transition hover:bg-zinc-900/5 dark:hover:bg-white/5 px-2 whitespace-nowrap"
      >
        <span>{currentLanguage.shortName}</span>
        <ChevronDownIcon className="h-4 w-4" />
      </button>

      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 sm:left-0 mt-2 w-28 rounded-md bg-white shadow-lg ring-1 ring-zinc-300 ring-opacity-5 dark:ring-zinc-600 dark:bg-zinc-800"
        >
          <div className="py-1">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`block w-full px-4 py-2 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-700 ${
                  currentLocale === language.code
                    ? 'bg-sky-100 text-zinc-900 dark:bg-sky-700 dark:text-white'
                    : 'text-zinc-700 dark:text-zinc-300'
                }`}
              >
                {language.name}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
} 