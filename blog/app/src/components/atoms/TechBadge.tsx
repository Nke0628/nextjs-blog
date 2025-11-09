import React from 'react'

type Props = {
  text: string
  color: string
}

const TechBadge: React.FC<Props> = ({ text, color }) => {
  return (
    <span
      className="m-1 inline-flex items-center rounded-md px-3 py-1 text-xs font-medium text-white"
      style={{ backgroundColor: color }}
    >
      {text}
    </span>
  )
}

export default TechBadge
