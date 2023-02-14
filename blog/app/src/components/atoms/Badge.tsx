import React from 'react'

type Props = {
  text: string
}

const Badge: React.FC<Props> = ({ text }) => {
  return (
    <span className="m-1 inline-flex items-center rounded-full bg-sky-500 px-5 py-2 text-sm text-white transition ease-in-out duration-200 hover:bg-sky-600">
      # {text}
    </span>
  )
}

export default Badge
