import React from 'react'

type Props = {
  text: string
}

const SubHeading: React.FC<Props> = ({ text }) => {
  return (
    <div className="py-6 md:py-8 px-4 md:px-0">
      <div className="relative animate-scan-in">
        <p className="font-mono text-xs text-primary-600 dark:text-primary-400 mb-1.5">
          $ cd ~/{text}
        </p>
        <h1 className="text-2xl md:text-3xl font-semibold text-ink-900 dark:text-ink-100 tracking-tight inline-flex items-baseline gap-2">
          {text}
          <span className="h-[3px] w-10 self-center rounded-full bg-gradient-to-r from-primary-400 to-accent-500" />
        </h1>
      </div>
    </div>
  )
}
export default SubHeading
