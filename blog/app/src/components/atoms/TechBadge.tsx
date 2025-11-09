import React from 'react'

type Props = {
  text: string
  color: string
}

const TechBadge: React.FC<Props> = ({ text }) => {
  return (
    <span className="m-1 inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300">
      {text}
    </span>
  )
}

export default TechBadge
