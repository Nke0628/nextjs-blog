import React from 'react'

type Props = {
  children: React.ReactNode
}

const Container: React.FC<Props> = ({ children }) => {
  return <div className="container mx-auto px-4 py-2 md:px-20">{children}</div>
}

export default Container
