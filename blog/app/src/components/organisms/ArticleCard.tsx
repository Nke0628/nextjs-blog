import React from 'react'

type Props = {
  subTitle: string
  title: string
  footerText: string
}

const ArticleCard: React.FC<Props> = ({ subTitle, title, footerText }) => {
  return (
    <li className="rounded-lg bg-gray-500 px-6 py-4 h-full flex flex-col justify-between">
      <div className="text-white">{subTitle}</div>
      <div className="text-white text-2xl font-bold mt-10">{title}</div>
      <div className="mt-10 text-right text-white">{footerText}</div>
    </li>
  )
}

export default ArticleCard
