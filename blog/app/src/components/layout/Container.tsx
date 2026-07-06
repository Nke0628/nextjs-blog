import React from 'react'

type Props = {
  children: React.ReactNode
}

const Container: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-ink-950 bg-blueprint text-ink-900 dark:text-ink-100 transition-colors duration-300 flex flex-col">
      <div className="container mx-auto px-4 py-2 md:px-20 flex-1 flex flex-col">
        {children}
      </div>
    </div>
  )
}

export default Container
