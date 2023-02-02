import parse from 'html-react-parser'
import React from 'react'

type Props = {
  contentHtml: string
}

const ArticleTeplate: React.FC<Props> = ({ contentHtml }) => {
  return <>{parse(contentHtml)}</>
}

export default ArticleTeplate
