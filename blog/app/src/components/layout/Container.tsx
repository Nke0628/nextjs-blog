import React from 'react'

type Props = {
  children: React.ReactNode
}

const Container: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="container mx-auto px-4 py-2 md:px-20">{children}</div>
    </div>
  )
}

export default Container
