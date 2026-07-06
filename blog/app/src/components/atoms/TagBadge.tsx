import React from 'react'

type Props = {
  text: string
}

const TagBadge: React.FC<Props> = ({ text }) => {
  return (
    <span className="m-1 inline-flex items-center rounded-md border border-primary-500/40 dark:border-primary-400/40 bg-primary-500/5 dark:bg-primary-400/10 hover:bg-primary-500/15 dark:hover:bg-primary-400/20 hover:shadow-glow px-3 py-1 font-mono text-xs text-primary-700 dark:text-primary-300 transition-all duration-200">
      <span className="mr-0.5 opacity-60">#</span>
      {text}
    </span>
  )
}

export default TagBadge
