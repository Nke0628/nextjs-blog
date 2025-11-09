import React from 'react'

type Props = {
  text: string
}

const SubHeading: React.FC<Props> = ({ text }) => {
  return (
    <div className="py-8 md:py-12">
      <div className="relative">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent animate-fade-in pb-2 leading-tight">
          {text}
        </h1>
        <div className="mt-4 h-1 w-20 bg-gradient-primary rounded-full"></div>
      </div>
    </div>
  )
}
export default SubHeading
