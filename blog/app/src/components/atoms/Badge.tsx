import React from 'react'

type Props = {
  text: string
}

const Badge: React.FC<Props> = ({ text }) => {
  return (
    <span className="m-1 inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer">
      {text}
    </span>
  )
}

export default Badge
