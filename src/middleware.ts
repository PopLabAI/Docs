import { NextRequest, NextResponse } from 'next/server'

const locales = ['en', 'zh-CN', 'ja-JP']
const defaultLocale = 'en'

// get user preferred language
function getLocale(request: NextRequest): string {
  // get user preferred language from Accept-Language header
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].trim())
      .find((lang) => {
        if (lang.startsWith('zh')) return true
        if (lang.startsWith('ja')) return true
        if (lang.startsWith('en')) return true
        return false
      })
    
    if (preferredLocale) {
      // return correct language code
      if (preferredLocale.startsWith('zh')) return 'zh-CN'
      if (preferredLocale.startsWith('ja')) return 'ja-JP'
      if (preferredLocale.startsWith('en')) return 'en'
    }
  }

  return defaultLocale
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // skip static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return
  }

  // check if path already contains language code
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  // if path already contains language code, return, no redirect
  if (pathnameHasLocale) {
    return
  }

  // redirect to path with language code
  const locale = getLocale(request)
  const newUrl = new URL(`/${locale}${pathname}`, request.url)
  
  // keep query parameters
  newUrl.search = request.nextUrl.search
  
  return NextResponse.redirect(newUrl)
}

export const config = {
  matcher: [
    // skip all internal paths (_next)
    // skip all API routes
    // skip all static files
    '/((?!_next|api|.*\\..*).*)',
  ],
} 