import { ParsedUrlQuery } from 'querystring'

import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import Link from 'next/link'

import ArticleTeplate from '@/components/organisms/ArticleTemplate'
import { client } from '@/modules/client'
import { article, PreviewData } from '@/types/type'
import { formatUTCtoJST } from '@/utils/date'

type Props = {
  article: article
  preview?: boolean
}

interface Params extends ParsedUrlQuery {
  id: string
}

const ArticlesId: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  article,
  preview,
}: Props) => {
  return (
    <>
      {preview && (
        <div className="bg-yellow-100 dark:bg-yellow-900 border-b-2 border-yellow-400 dark:border-yellow-600 px-4 py-3 text-center">
          <div className="flex items-center justify-center gap-4">
            <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              プレビューモード中
            </span>
            <button
              onClick={() => {
                window.location.href = '/api/exit-preview'
              }}
              className="text-xs font-medium text-yellow-700 dark:text-yellow-300 underline hover:text-yellow-900 dark:hover:text-yellow-100 cursor-pointer"
            >
              プレビューを終了
            </button>
          </div>
        </div>
      )}
      <main className="py-8 md:w-3/5 mx-auto">
        <h1 className="text-center text-3xl font-bold my-3 ">{article.title}</h1>
        <p className="text-right mt-3 mb-9">
          {formatUTCtoJST(article.publishedAt)}
        </p>
        <div className="mx-auto">
          <ArticleTeplate contentHtml={article.content}></ArticleTeplate>
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          {article.categories.map((tag) => (
            <Link
              href={`/tags/${tag.slug}/page/1`}
              key={tag.id}
              className="group inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-2 transition-all duration-200"
            >
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                #{tag.name}
              </span>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}

export const getStaticPaths = async () => {
  const data = await client.get({ endpoint: 'articles' })
  const paths = data.contents.map(
    (content: article) => `/articles/${content.id}`,
  )
  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps<Props, Params> = async ({
  params,
  preview,
  previewData,
}) => {
  const id = params!.id

  // プレビューモード時
  if (preview && previewData) {
    const { draftKey } = previewData as PreviewData
    const data = await client.get({
      endpoint: 'articles',
      contentId: id,
      queries: { draftKey },
    })
    return {
      props: {
        article: data,
        preview: true,
      },
    }
  }

  // 通常モード
  const data = await client.get({ endpoint: 'articles', contentId: id })
  return {
    props: {
      article: data,
      preview: false,
    },
  }
}

export default ArticlesId
