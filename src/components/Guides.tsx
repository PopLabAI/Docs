'use client'
import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'
import { usePathname } from 'next/navigation'
import { getLocaleFromPath } from '@/lib/locale'

function getGuides(locale: string) {
  const isZh = locale === 'zh-CN'
  const isJa = locale === 'ja-JP'
  const prefix = locale === 'en' ? '' : `/${locale}`

  return [
    {
      href: `${prefix}/createappwithai`,
      name: isZh ? 'AI 创建应用' : isJa ? 'AI でアプリ作成' : 'Create App with AI',
      description: isZh 
        ? '只需一个 idea，AI 即可在几秒钟内为你创建 Pop AI 应用。'
        : isJa 
        ? 'アイデアがあれば、AI で数秒で Pop アプリを簡単に作成できます。'
        : 'With an idea, AI can create a Pop AI App in seconds.',
    },
    {
      href: `${prefix}/popbox`,
      name: 'PopBox',
      description: isZh 
        ? '在 PopBox 创意社区中探索来自全球创作者的优秀 Pop AI 应用。'
        : isJa 
        ? 'PopBox クリエイティブコミュニティで、世界中のクリエイターが作成した素晴らしい Pop AI アプリを探索・共有できます。'
        : 'Through PopBox creative community, explore and share awesome Pop AI Apps from creators around the world.',
    },
    {
      href: `${prefix}/aimodes`,
      name: isZh ? '支持的 AI 模型' : isJa ? '対応 AI モード' : 'Supported AI Modes',
      description: isZh 
        ? '了解 PopLab 支持的 AI 模型和能力。从文本到图片，满足大部份应用需求。'
        : isJa 
        ? 'PopLab が対応している AI モデルを確認してください。テキストから画像まで、ほとんどのアプリの要件を満たします。'
        : 'Check out which AI Models are supported by PopLab. From text to image, most app requirements are met.',
    },
    {
      href: `${prefix}/deploy`,
      name: isZh ? '私有部署 🔥' : isJa ? 'プライベートデプロイ 🔥' : 'Private Deployment 🔥',
      description: isZh 
        ? '在您自己的服务器上部署 PopLab，为您的团队或客户提供私有化服务。'
        : isJa 
        ? '独自のサーバーに PopLab をデプロイする方法を学びます。チームや顧客向けのプライベートサービスを提供できます。'
        : 'Learn how to deploy PopLab on your own server. Provide private services for your team or customers.',
    },
  ]
}

export function Guides() {
  const pathname = usePathname()
  
  const currentLocale = getLocaleFromPath(pathname)
  
  const guides = getGuides(currentLocale)

  return (
    <div className="my-16 xl:max-w-none">
      <Heading level={2} id="guides">
        {currentLocale === 'zh-CN' ? '快速开始' : currentLocale === 'ja-JP' ? 'クイックスタート' : 'Quick Start'}
      </Heading>
      <div className="not-prose mt-4 grid grid-cols-1 gap-8 border-t border-zinc-900/5 pt-10 sm:grid-cols-2 xl:grid-cols-4 dark:border-white/5">
        {guides.map((guide) => (
          <div key={guide.href}>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              {guide.name}
            </h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {guide.description}
            </p>
            <p className="mt-4">
              <Button href={guide.href} variant="text" arrow="right">
                {currentLocale === 'zh-CN' ? '了解更多' : currentLocale === 'ja-JP' ? '詳細を見る' : 'Read more'}
              </Button>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
