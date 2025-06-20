import Link from 'next/link'
import { ReactNode } from 'react'

interface AppCardProps {
  title: string
  description: string
  icon: ReactNode
  provider: string
  href: string
  tags?: string[]
}

function PoplabIcon ({ className }: { className: string }) {
  return (
    <svg  viewBox="0 0 120 138" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect y="72" width="101" height="50" rx="8" fill="#FF640B" />
      <rect x="30.4736" y="46" width="101" height="50" rx="8" transform="rotate(28 30.4736 46)" fill="#FFA228" />
      <rect x="53.4519" width="101" height="50" rx="8" transform="rotate(56 53.4519 0)" fill="#FFD666" />
    </svg>
  )
}

export function AppCard({ title, description, icon, provider, href, tags }: AppCardProps) {
  return (
    <Link
      href={href}
      className="not-prose relative group block rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:shadow-amber-200/30 hover:border-amber-300 dark:border-zinc-700 dark:hover:shadow-amber-800/30 dark:bg-zinc-800 dark:hover:border-amber-400/50 hover:!no-underline"
    >
      <div className="flex flex-col items-start gap-4 relative">
        <div className="flex-shrink-0">
          <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20 overflow-hidden border-[0.5px] border-zinc-300 dark:border-zinc-600">
            {icon}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="!my-0 text-lg font-semibold text-zinc-900 dark:text-white">
              {title}
            </h3>
          </div>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {description}
          </p>
          {tags && tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1">
              <span className="inline-flex items-center rounded-full bg-green-100 px-[10px] py-0 text-xs font-medium text-green-800 dark:bg-green-900/20 dark:text-green-300">
              {provider}
            </span>
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full bg-zinc-100 px-[10px] py-0 text-xs font-medium text-zinc-800 dark:bg-zinc-700 dark:text-zinc-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="absolute top-0 right-0">
        <PoplabIcon className='h-8 w-8' />
      </div>
      </div>
    </Link>
  )
} 