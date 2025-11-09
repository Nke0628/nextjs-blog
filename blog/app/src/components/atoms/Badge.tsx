import React from 'react'

type Props = {
  text: string
}

const Badge: React.FC<Props> = ({ text }) => {
  return (
    <span className="m-1 inline-flex items-center rounded-full bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer">
      # {text}
    </span>
  )
}

export default Badge
