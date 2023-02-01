import React from 'react'

type Props = {
  text: string
}

const SubHeading: React.FC<Props> = ({ text }) => {
  return (
    <div className="py-4">
      <h1 className="text-lg font-bold text-gray-300">{text}</h1>
    </div>
  )
}
export default SubHeading
