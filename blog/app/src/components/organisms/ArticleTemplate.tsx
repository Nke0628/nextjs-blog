import hilight from 'highlight.js'
import parse, {
  Element,
  domToReact,
  HTMLReactParserOptions,
} from 'html-react-parser'
import React from 'react'
import 'highlight.js/styles/hybrid.css'

type Props = {
  contentHtml: string
}

const ArticleTeplate: React.FC<Props> = ({ contentHtml }) => {
  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.name === 'h1') {
        return (
          <>
            <h1 className="text-3xl mt-6">{domToReact(domNode.children)}</h1>
            <hr className="h-[0.5px] md:h-[0.1px] mt-2 mb-6 bg-gray-200 border-0 bg-gray-500"></hr>
          </>
        )
      }
      if (domNode instanceof Element && domNode.name === 'h2') {
        return (
          <>
            <h2 className="text-xl mt-6">{domToReact(domNode.children)}</h2>
          </>
        )
      }
      if (domNode instanceof Element && domNode.name === 'ul') {
        return (
          <>
            <ul className="py-2 px-5 list-disc">
              {domToReact(domNode.children, options)}
            </ul>
          </>
        )
      }
      if (domNode instanceof Element && domNode.name === 'ol') {
        return (
          <>
            <ul className="py-2 px-5 list-decimal">
              {domToReact(domNode.children, options)}
            </ul>
          </>
        )
      }
      if (domNode instanceof Element && domNode.name === 'blockquote') {
        return (
          <>
            <blockquote className="p-4 my-4 border-l-4 border-gray-500 bg-gray-200 dark:border-gray-500 dark:bg-gray-800">
              <p className="font-medium leading-relaxed text-gray-700 dark:text-white">
                {domToReact(domNode.children)}
              </p>
            </blockquote>
          </>
        )
      }
      if (domNode instanceof Element && domNode.name === 'a') {
        return (
          <>
            <a
              {...domNode.attribs}
              rel="noreferrer"
              className="text-sky-500 block px-1 py-2"
            >
              {domToReact(domNode.children)}
            </a>
          </>
        )
      }
      if (domNode instanceof Element && domNode.name === 'code') {
        const languageSubset = [
          'js',
          'html',
          'css',
          'xml',
          'typescript',
          'python',
          'php',
        ]
        const hilightCode = hilight.highlightAuto(
          domToReact(domNode.children) as string,
          languageSubset,
        )
        const dom = parse(hilightCode.value)
        return <code className="hljs">{dom}</code>
      }
    },
  }
  return <>{parse(contentHtml, options)}</>
}

export default ArticleTeplate
