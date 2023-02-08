import React from 'react'

type Props = {
  text: string
}

const Badge: React.FC<Props> = ({ text }) => {
  return (
    <span className="m-1 inline-flex items-center rounded-full bg-gray-700 px-5 py-2 text-sm text-gray-300 transition ease-in-out duration-200 hover:text-gray-200 hover:bg-gray-600">
      {text}
    </span>
  )
}

export default Badge
