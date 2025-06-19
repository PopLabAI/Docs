export type Locale = 'en' | 'zh-CN' | 'ja-JP'

export function getLocaleFromPath(pathname: string): Locale {
  if (pathname.startsWith('/zh-CN')) {
    return 'zh-CN'
  }
  if (pathname.startsWith('/ja-JP')) {
    return 'ja-JP'
  }
  return 'en'
} 