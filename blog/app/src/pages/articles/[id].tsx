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
      <main className="py-8 w-full md:w-3/5 mx-auto">
        <h1 className="text-center text-3xl font-bold my-3 ">{article.title}</h1>
        <p className="text-right mt-3 mb-9 font-mono text-sm text-ink-400 dark:text-ink-400">
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
              className="group inline-flex items-center rounded-md border border-ink-300 dark:border-ink-700 bg-white/60 dark:bg-ink-900/60 hover:border-primary-400 dark:hover:border-primary-400/60 hover:shadow-glow px-4 py-2 transition-all duration-200"
            >
              <span className="font-mono text-xs text-ink-600 dark:text-ink-300 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                <span className="text-primary-500 dark:text-primary-400 mr-0.5">
                  #
                </span>
                {tag.name}
              </span>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}

export const getStaticPaths = async () => {
  const data = await client.get({
    endpoint: 'articles',
    queries: { limit: 1000 },
  })
  const paths = data.contents.map(
    (content: article) => `/articles/${content.id}`,
  )
  return { paths, fallback: 'blocking' }
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
