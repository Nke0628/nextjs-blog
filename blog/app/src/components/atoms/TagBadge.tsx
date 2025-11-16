import React from 'react'

type Props = {
  text: string
}

const TagBadge: React.FC<Props> = ({ text }) => {
  return (
    <span className="m-1 inline-flex items-center rounded-md border-2 border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-400 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
      #{text}
    </span>
  )
}

export default TagBadge
