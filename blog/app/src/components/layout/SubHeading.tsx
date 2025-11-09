import React from 'react'

type Props = {
  text: string
}

const SubHeading: React.FC<Props> = ({ text }) => {
  return (
    <div className="py-6 md:py-8">
      <div className="relative">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100 animate-fade-in tracking-tight">
          {text}
        </h1>
      </div>
    </div>
  )
}
export default SubHeading
