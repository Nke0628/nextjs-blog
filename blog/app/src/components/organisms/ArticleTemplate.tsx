import React from 'react'

import hilight from 'highlight.js'
import parse, {
  Element,
  Text,
  domToReact,
  HTMLReactParserOptions,
} from 'html-react-parser'
import 'highlight.js/styles/hybrid.css'

type Props = {
  contentHtml: string
}

const ArticleTeplate: React.FC<Props> = ({ contentHtml }) => {
  // HTMLエンティティをデコードする関数（SSR対応）
  const decodeHtmlEntities = (html: string): string => {
    const entities: { [key: string]: string } = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&#x27;': "'",
      '&#x2F;': '/',
    }
    return html.replace(
      /&(?:amp|lt|gt|quot|#39|#x27|#x2F);/g,
      (match) => entities[match] || match,
    )
  }

  // HTMLエンティティをデコード
  const decodedHtml = decodeHtmlEntities(contentHtml)

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
      if (domNode instanceof Element && domNode.name === 'aside') {
        return (
          <>
            <aside className="p-4 my-4 border-l-4 border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20">
              {domToReact(domNode.children, options)}
            </aside>
          </>
        )
      }
      if (domNode instanceof Element && domNode.name === 'a') {
        return (
          <>
            <a
              {...domNode.attribs}
              rel="noreferrer"
              className="text-sky-500 px-1 py-2 break-words"
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
        // テキストノードからテキストを直接抽出
        const codeText = domNode.children
          .map((child) => {
            if (child instanceof Text) {
              return child.data
            }
            return ''
          })
          .join('')

        const hilightCode = hilight.highlightAuto(codeText, languageSubset)
        const dom = parse(hilightCode.value)
        return <code className="hljs">{dom}</code>
      }
    },
  }
  return <>{parse(decodedHtml, options)}</>
}

export default ArticleTeplate
