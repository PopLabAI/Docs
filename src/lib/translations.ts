export type Locale = 'en' | 'zh-CN' | 'ja-JP'

export interface Translations {
  [key: string]: {
    [locale in Locale]: string
  }
}

export const translations: Translations = {
  'nav.quickstart': {
    'en': 'Quickstart',
    'zh-CN': '快速开始',
    'ja-JP': 'クイックスタート',
  }
}

export function t(key: string, locale: Locale, content: Translations): string {
  const translation = content[key]
  if (!translation) {
    console.warn(`Translation key "${key}" not found for locale "${locale}"`)
    return key
  }
  return translation[locale] || translation['en'] || key
}

export function getCurrentLocale(): Locale {
  if (typeof window === 'undefined') {
    return 'en'
  }
  
  const locale = window.localStorage.getItem('locale') as Locale
  if (locale && ['en', 'zh-CN', 'ja-JP'].includes(locale)) {
    return locale
  }
  
  const browserLang = navigator.language
  if (browserLang.startsWith('zh')) {
    return 'zh-CN'
  }
  if (browserLang.startsWith('ja')) {
    return 'ja-JP'
  }
  
  return 'en'
}

export function setLocale(locale: Locale): void {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('locale', locale)
  }
} 