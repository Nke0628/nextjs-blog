import { ParsedUrlQuery } from 'querystring'

import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'

import Pagination from '@/components/atoms/Pagination'
import Container from '@/components/layout/Container'
import SubHeading from '@/components/layout/SubHeading'
import ArticleCardList from '@/components/template/ArticleCardList'
import { client } from '@/modules/client'
import { articles, tag } from '@/types/type'

type Props = {
  articles: articles
  totalCount: number
  currentPage: number
  tag: tag
}

interface Params extends ParsedUrlQuery {
  slug: string
  pageId: string
}

const PAGE_ARTICLE_LIMIT = 6

const TagArticlesPage: NextPage<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ articles, totalCount, currentPage, tag }: Props) => {
  return (
    <Container>
      <SubHeading text={`#${tag.name} の記事一覧`} />
      {/* {tag.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 mb-8">
          {tag.description}
        </p>
      )} */}
      {articles.length === 0 ? (
        <div className="text-center py-16">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
            このタグの記事はまだありません
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            今後の記事投稿をお楽しみに
          </p>
        </div>
      ) : (
        <>
          <ArticleCardList articles={articles} />
          <div className="mt-12">
            <Pagination
              currentPage={currentPage}
              totalCount={totalCount}
              pageSize={PAGE_ARTICLE_LIMIT}
              basePath={`/tags/${tag.slug}/page`}
            />
          </div>
        </>
      )}
    </Container>
  )
}

export const getStaticPaths = async () => {
  const categoriesData = await client.get({ endpoint: 'categories' })
  const paths: string[] = []

  for (const category of categoriesData.contents) {
    const articlesData = await client.get({
      endpoint: 'articles',
      queries: {
        filters: `categories[contains]${category.id}`,
      },
    })

    const totalPages = Math.max(
      1,
      Math.ceil(articlesData.totalCount / PAGE_ARTICLE_LIMIT),
    )

    for (let i = 1; i <= totalPages; i++) {
      paths.push(`/tags/${category.slug}/page/${i}`)
    }
  }

  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps<Props, Params> = async ({
  params,
}) => {
  const slug = params!.slug
  const pageId = params!.pageId

  const categoriesData = await client.get({
    endpoint: 'categories',
    queries: {
      filters: `slug[equals]${slug}`,
    },
  })

  if (!categoriesData.contents || categoriesData.contents.length === 0) {
    return {
      notFound: true,
    }
  }

  const tag = categoriesData.contents[0]

  const articlesData = await client.get({
    endpoint: 'articles',
    queries: {
      filters: `categories[contains]${tag.id}`,
      offset: (Number(pageId) - 1) * PAGE_ARTICLE_LIMIT,
      limit: PAGE_ARTICLE_LIMIT,
    },
  })

  return {
    props: {
      articles: articlesData.contents,
      totalCount: articlesData.totalCount,
      currentPage: Number(pageId),
      tag: tag,
    },
  }
}

export default TagArticlesPage
