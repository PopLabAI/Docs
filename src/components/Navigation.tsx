'use client'

import clsx from 'clsx'
import { AnimatePresence, motion, useIsPresent } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef } from 'react'

import { Button } from '@/components/Button'
import { useIsInsideMobileNavigation } from '@/components/MobileNavigation'
import { useSectionStore } from '@/components/SectionProvider'
import { Tag } from '@/components/Tag'
import { remToPx } from '@/lib/remToPx'
import { getLocaleFromPath } from '@/lib/locale'
import { CloseButton } from '@headlessui/react'

interface NavGroup {
  title: string
  links: Array<{
    title: string
    href: string
  }>
}

function useInitialValue<T>(value: T, condition = true) {
  let initialValue = useRef(value).current
  return condition ? initialValue : value
}

function getNavigation(locale: string): Array<NavGroup> {
  const isZh = locale === 'zh-CN'
  const isJa = locale === 'ja-JP'
  const prefix = `/${locale}`

  return [
    {
      title: isZh ? '指南' : isJa ? 'ガイド' : 'Guides',
      links: [
        { title: isZh ? '欢迎使用' : isJa ? 'へようこそ' : 'Welcome', href: `${prefix}` },
        { title: isZh ? '快速开始' : isJa ? 'クイックスタート' : 'Quickstart', href: `${prefix}/quickstart` },
        { title: isZh ? 'AI 创建应用' : isJa ? 'AI でアプリ作成' : 'Create App with AI', href: `${prefix}/createappwithai` },
        { title: isZh ? '创建应用' : isJa ? 'アプリ作成' : 'Create App', href: '/createapp' },
        { title: isZh ? '体验应用' : isJa ? 'アプリ体験' : 'Play App', href: '#' },
        { title: isZh ? '分享应用' : isJa ? 'アプリ共有' : 'Share App', href: '#' },
        { title: isZh ? '历史记录' : isJa ? '履歴記録' : 'History Records', href: '#' },
        { title: isZh ? '更新日志' : isJa ? '変更履歴' : 'Changelog', href: '#' },
        { title: isZh ? '支持' : isJa ? 'サポート' : 'Support', href: '#' },
      ],
    },
    {
      title: 'PopBox',
      links: [
        { title: isZh ? '介绍' : isJa ? '紹介' : 'Introduction', href: '#' },
        { title: isZh ? '集合' : isJa ? 'コレクション' : 'Collections', href: '#' },
        { title: isZh ? '社区' : isJa ? 'コミュニティ' : 'Community', href: '#' },
      ],
    },
    {
      title: isZh ? 'AI 模型' : isJa ? 'AI モデル' : 'AI Models',
      links: [
        { title: isZh ? '支持的 AI 模型' : isJa ? '対応 AI モデル' : 'Supported AI Models', href: '#' },
        { title: isZh ? 'API 密钥管理' : isJa ? 'API キー管理' : 'API Key Management', href: '#' },
        { title: 'Gemini API', href: '#' },
        { title: 'OpenAI API', href: '#' },
        { title: 'Anthropic API', href: '#' },
        { title: 'DeepSeek API', href: '#' },
      ],
    },
    {
      title: isZh ? '开源' : isJa ? 'オープンソース' : 'Open Source',
      links: [
        { title: isZh ? '部署' : isJa ? 'デプロイ' : 'Deploy', href: '#' },
        { title: isZh ? 'Docker 镜像' : isJa ? 'Docker イメージ' : 'Docker Image', href: '#' },
        { title: isZh ? '开发' : isJa ? '開発' : 'Develop', href: '#' },
      ],
    },
  ]
}

function TopLevelNavItem({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <li className="md:hidden">
      <CloseButton
        as={Link}
        href={href}
        className="block py-1 text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
      >
        {children}
      </CloseButton>
    </li>
  )
}

function NavLink({
  href,
  children,
  tag,
  active = false,
  isAnchorLink = false,
}: {
  href: string
  children: React.ReactNode
  tag?: string
  active?: boolean
  isAnchorLink?: boolean
}) {
  return (
    <CloseButton
      as={Link}
      href={href}
      aria-current={active ? 'page' : undefined}
      className={clsx(
        'flex justify-between gap-2 py-1 pr-3 text-sm transition',
        isAnchorLink ? 'pl-7' : 'pl-4',
        active
          ? 'text-zinc-900 dark:text-white'
          : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white',
      )}
    >
      <span className="truncate">{children}</span>
      {tag && (
        <Tag variant="small" color="zinc">
          {tag}
        </Tag>
      )}
    </CloseButton>
  )
}

function VisibleSectionHighlight({
  group,
  pathname,
}: {
  group: NavGroup
  pathname: string
}) {
  let [sections, visibleSections] = useInitialValue(
    [
      useSectionStore((s) => s.sections),
      useSectionStore((s) => s.visibleSections),
    ],
    useIsInsideMobileNavigation(),
  )

  let isPresent = useIsPresent()
  let firstVisibleSectionIndex = Math.max(
    0,
    [{ id: '_top' }, ...sections].findIndex(
      (section) => section.id === visibleSections[0],
    ),
  )
  let itemHeight = remToPx(2)
  let height = isPresent
    ? Math.max(1, visibleSections.length) * itemHeight
    : itemHeight
  let top =
    group.links.findIndex((link) => link.href === pathname) * itemHeight +
    firstVisibleSectionIndex * itemHeight

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0 }}
      className="absolute inset-x-0 top-0 bg-zinc-800/2.5 will-change-transform dark:bg-white/2.5"
      style={{ borderRadius: 8, height, top }}
    />
  )
}

function ActivePageMarker({
  group,
  pathname,
}: {
  group: NavGroup
  pathname: string
}) {
  let itemHeight = remToPx(2)
  let offset = remToPx(0.25)
  let activePageIndex = group.links.findIndex((link) => link.href === pathname)
  let top = offset + activePageIndex * itemHeight

  return (
    <motion.div
      layout
      className="absolute left-2 h-6 w-px bg-amber-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0 }}
      style={{ top }}
    />
  )
}

function NavigationGroup({
  group,
  className,
}: {
  group: NavGroup
  className?: string
}) {
  // If this is the mobile navigation then we always render the initial
  // state, so that the state does not change during the close animation.
  // The state will still update when we re-open (re-render) the navigation.
  let isInsideMobileNavigation = useIsInsideMobileNavigation()
  let [pathname, sections] = useInitialValue(
    [usePathname(), useSectionStore((s) => s.sections)],
    isInsideMobileNavigation,
  )

  let isActiveGroup =
    group.links.findIndex((link) => link.href === pathname) !== -1

  return (
    <li className={clsx('relative mt-6', className)}>
      <motion.h2
        layout="position"
        className="text-xs font-semibold text-zinc-900 dark:text-white"
      >
        {group.title}
      </motion.h2>
      <div className="relative mt-3 pl-2">
        <AnimatePresence initial={!isInsideMobileNavigation}>
          {isActiveGroup && (
            <VisibleSectionHighlight group={group} pathname={pathname} />
          )}
        </AnimatePresence>
        <motion.div
          layout
          className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/5"
        />
        <AnimatePresence initial={false}>
          {isActiveGroup && (
            <ActivePageMarker group={group} pathname={pathname} />
          )}
        </AnimatePresence>
        <ul role="list" className="border-l border-transparent">
          {group.links.map((link) => (
            <motion.li key={link.href} layout="position" className="relative">
              <NavLink href={link.href} active={link.href === pathname}>
                {link.title}
              </NavLink>
              <AnimatePresence mode="popLayout" initial={false}>
                {link.href === pathname && sections.length > 0 && (
                  <motion.ul
                    role="list"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      transition: { delay: 0.1 },
                    }}
                    exit={{
                      opacity: 0,
                      transition: { duration: 0.15 },
                    }}
                  >
                    {sections.map((section) => (
                      <li key={section.id}>
                        <NavLink
                          href={`${link.href}#${section.id}`}
                          tag={section.tag}
                          isAnchorLink
                        >
                          {section.title}
                        </NavLink>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.li>
          ))}
        </ul>
      </div>
    </li>
  )
}

export function Navigation(props: React.ComponentPropsWithoutRef<'nav'>) {
  const pathname = usePathname()
  
  // get current locale from path
  const currentLocale = getLocaleFromPath(pathname)
  
  // get navigation data for current locale
  const navigation = getNavigation(currentLocale)

  return (
    <nav {...props}>
      <ul role="list">
        <TopLevelNavItem href="/support">Support</TopLevelNavItem>
        {navigation.map((group, groupIndex) => (
          <NavigationGroup
            key={group.title}
            group={group}
            className={groupIndex === 0 ? 'md:mt-0' : ''}
          />
        ))}
        <li className="sticky bottom-0 z-10 mt-6 min-[416px]:hidden">
          <Button href="https://poplab.ai" variant="filled" className="w-full">
            {currentLocale === 'zh-CN' ? '前往 PopLab' : currentLocale === 'ja-JP' ? 'PopLab へ' : 'Go to PopLab'}
          </Button>
        </li>
      </ul>
    </nav>
  )
}

// export navigation function for other components
export function useNavigation() {
  const pathname = usePathname()
  const currentLocale = getLocaleFromPath(pathname)
  return getNavigation(currentLocale)
}
