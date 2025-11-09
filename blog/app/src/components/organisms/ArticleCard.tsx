import React from 'react'

type Props = {
  subTitle: string
  title: string
  footerText: string
}

const ArticleCard: React.FC<Props> = ({ subTitle, title, footerText }) => {
  return (
    <li className="group rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 shadow-soft hover:shadow-xl px-6 py-8 h-full flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="text-sm font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wide">
        {subTitle}
      </div>

      <div className="text-gray-900 dark:text-white text-2xl font-bold mt-6 leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
        {title}
      </div>

      <div className="mt-6 text-right text-sm text-gray-600 dark:text-gray-400 font-medium">
        {footerText}
      </div>
    </li>
  )
}

export default ArticleCard
