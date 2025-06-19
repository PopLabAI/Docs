import fs from 'fs'
import path from 'path'
import { Locale } from './translations'

export interface ContentFile {
  path: string
  locale: Locale
  content: string
  metadata: any
}

export class ContentManager {
  private baseDir: string

  constructor(baseDir: string = 'src/app') {
    this.baseDir = baseDir
  }

  // get content file for specified language
  async getContent(filePath: string, locale: Locale): Promise<ContentFile | null> {
    const localizedPath = this.getLocalizedPath(filePath, locale)
    
    try {
      const fullPath = path.join(this.baseDir, localizedPath)
      const content = await fs.promises.readFile(fullPath, 'utf-8')
      
      // extract metadata
      const metadata = this.extractMetadata(content)
      
      return {
        path: localizedPath,
        locale,
        content,
        metadata
      }
    } catch (error) {
      // if localized file does not exist, try to get default language file
      if (locale !== 'en') {
        return this.getContent(filePath, 'en')
      }
      return null
    }
  }

  // get content files for all languages
  async getAllLocales(filePath: string): Promise<ContentFile[]> {
    const locales: Locale[] = ['en', 'zh-CN', 'ja-JP']
    const results: ContentFile[] = []

    for (const locale of locales) {
      const content = await this.getContent(filePath, locale)
      if (content) {
        results.push(content)
      }
    }

    return results
  }

  // create localized path
  private getLocalizedPath(filePath: string, locale: Locale): string {
    if (locale === 'en') {
      return filePath
    }
    
    const dir = path.dirname(filePath)
    const name = path.basename(filePath)
    
    return path.join(dir, locale, name)
  }

  // extract metadata from MDX file
  private extractMetadata(content: string): any {
    const metadataMatch = content.match(/export const metadata = ({[\s\S]*?});/)
    if (metadataMatch) {
      try {
        // simple metadata parsing, may need more complex parsing in actual project
        const metadataStr = metadataMatch[1]
        return eval(`(${metadataStr})`)
      } catch (error) {
        console.warn('Failed to parse metadata:', error)
        return {}
      }
    }
    return {}
  }

  // check if file exists
  async fileExists(filePath: string, locale: Locale): Promise<boolean> {
    const localizedPath = this.getLocalizedPath(filePath, locale)
    const fullPath = path.join(this.baseDir, localizedPath)
    
    try {
      await fs.promises.access(fullPath)
      return true
    } catch {
      return false
    }
  }

  // get available language list
  async getAvailableLocales(filePath: string): Promise<Locale[]> {
    const locales: Locale[] = ['en', 'zh-CN', 'ja-JP']
    const available: Locale[] = []

    for (const locale of locales) {
      const exists = await this.fileExists(filePath, locale)
      if (exists) {
        available.push(locale)
      }
    }

    return available
  }

  // create localized file
  async createLocalizedFile(
    originalPath: string,
    targetLocale: Locale,
    content: string
  ): Promise<void> {
    const localizedPath = this.getLocalizedPath(originalPath, targetLocale)
    const fullPath = path.join(this.baseDir, localizedPath)
    
    // ensure directory exists
    const dir = path.dirname(fullPath)
    await fs.promises.mkdir(dir, { recursive: true })
    
    // write file
    await fs.promises.writeFile(fullPath, content, 'utf-8')
  }
} 