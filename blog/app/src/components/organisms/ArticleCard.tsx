import React from 'react'

type Props = {
  subTitle: string
  title: string
  footerText: string
  index?: number
}

const ArticleCard: React.FC<Props> = ({
  subTitle,
  title,
  footerText,
  index,
}) => {
  return (
    <li className="group relative rounded-lg bg-white/80 dark:bg-ink-900/80 backdrop-blur-sm border border-ink-200 dark:border-ink-800 hover:border-primary-400 dark:hover:border-primary-400/60 px-6 py-6 h-full flex flex-col justify-between transition-all duration-300 hover:shadow-glow hover:-translate-y-0.5 cursor-pointer overflow-hidden">
      {/* 左端のアクセントバー */}
      <span className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-primary-400 to-accent-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-center justify-between font-mono text-xs">
        <span className="text-primary-600 dark:text-primary-400">
          {'// '}
          {subTitle}
        </span>
        {index !== undefined && (
          <span className="text-ink-300 dark:text-ink-600 tracking-widest">
            {String(index + 1).padStart(3, '0')}
          </span>
        )}
      </div>

      <div className="text-ink-900 dark:text-white text-lg font-semibold mt-3 leading-snug group-hover:text-primary-700 dark:group-hover:text-primary-200 transition-colors duration-300">
        {title}
      </div>

      <div className="mt-4 flex items-center justify-end gap-1.5 font-mono text-xs text-ink-400 dark:text-ink-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-3.5 h-3.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {footerText}
      </div>
    </li>
  )
}

export default ArticleCard
