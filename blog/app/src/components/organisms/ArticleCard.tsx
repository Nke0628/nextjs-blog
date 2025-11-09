import React from 'react'

type Props = {
  subTitle: string
  title: string
  footerText: string
}

const ArticleCard: React.FC<Props> = ({ subTitle, title, footerText }) => {
  return (
    <li className="group rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 px-6 py-6 h-full flex flex-col justify-between transition-all duration-200 hover:shadow-md cursor-pointer">
      <div className="text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wide">
        {subTitle}
      </div>

      <div className="text-gray-900 dark:text-white text-lg font-semibold mt-3 leading-snug">
        {title}
      </div>

      <div className="mt-4 text-right text-xs text-gray-500 dark:text-gray-500 font-medium">
        {footerText}
      </div>
    </li>
  )
}

export default ArticleCard
