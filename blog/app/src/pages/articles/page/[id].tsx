import { useEffect, useState } from 'react'

import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher'
import { useRouter } from 'next/router'

import Pagination from '@/components/atoms/Pagination'
import SearchBox from '@/components/atoms/SearchBox'
import SubHeading from '@/components/layout/SubHeading'
import ArticleCardList from '@/components/template/ArticleCardList'
import { client } from '@/modules/client'
import { articles } from '@/types/type'

const PAGE_ARTICLE_LIMIT = 6

type Props = {
  pageNum: number
  totalCount: number
  articles: articles
}

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  pageNum,
  totalCount,
  articles: initialArticles,
}: Props) => {
  const router = useRouter()
  const { q } = router.query
  const [articles, setArticles] = useState<articles>(initialArticles)
  const [loading, setLoading] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isSearchMode, setIsSearchMode] = useState<boolean>(false)

  const searchArticles = async (query: string) => {
    if (!query.trim()) {
      setIsSearchMode(false)
      setArticles(initialArticles)
      return
    }

    setLoading(true)
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query.trim())}`,
      )
      if (!response.ok) {
        throw new Error('Search failed')
      }
      const data = await response.json()
      setArticles(data.contents)
    } catch (error) {
      console.error('検索エラー:', error)
      setArticles([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const query = typeof q === 'string' ? q : ''
    setSearchQuery(query)

    if (query) {
      setIsSearchMode(true)
      searchArticles(query)
    } else {
      setIsSearchMode(false)
      setArticles(initialArticles)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, initialArticles])

  const handleSearch = (query: string) => {
    if (query) {
      router.push(`/articles/page/${pageNum}?q=${encodeURIComponent(query)}`)
    } else {
      router.push(`/articles/page/${pageNum}`)
    }
  }

  const handleClearSearch = () => {
    router.push(`/articles/page/${pageNum}`)
  }

  return (
    <>
      <SubHeading text="articles"></SubHeading>
      <div className="mx-auto md:px-5 py-12 md:max-w-5xl">
        <div className="mb-8 px-4 md:px-0">
          <SearchBox
            defaultValue={searchQuery}
            onSearch={handleSearch}
            className="max-w-2xl mx-auto"
          />
        </div>

        {isSearchMode && (
          <div className="mb-6 px-4 md:px-0 flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold">&quot;{searchQuery}&quot;</span> の検索結果:{' '}
              <span className="font-semibold">{articles.length}</span> 件
            </div>
            <button
              onClick={handleClearSearch}
              className="text-sm text-blue-500 dark:text-blue-400 hover:underline"
            >
              検索をクリア
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : articles.length > 0 ? (
          <>
            <ArticleCardList articles={articles}></ArticleCardList>
            {!isSearchMode && (
              <div className="mt-10">
                <Pagination
                  currentPage={pageNum}
                  totalCount={totalCount}
                  pageSize={PAGE_ARTICLE_LIMIT}
                />
              </div>
            )}
          </>
        ) : isSearchMode ? (
          <div className="text-center py-16">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
              該当する記事が見つかりませんでした
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              別のキーワードで検索してみてください
            </p>
          </div>
        ) : null}
      </div>
    </>
  )
}

export const getStaticPaths = async () => {
  const repos = await client.get({
    endpoint: 'articles',
    queries: { limit: 0 },
  })

  const range = (start: number, end: number) =>
    [...Array(end - start + 1)].map((_, i) => start + i)

  const paths = range(1, Math.ceil(repos.totalCount / PAGE_ARTICLE_LIMIT)).map(
    (repo) => `/articles/page/${repo}`,
  )

  return { paths, fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps<Props, Params> = async ({
  params,
}) => {
  const pageNum = params!.id
  const data = await client.get({
    endpoint: 'articles',
    queries: {
      offset: (pageNum - 1) * PAGE_ARTICLE_LIMIT,
      limit: PAGE_ARTICLE_LIMIT,
    },
  })
  return {
    props: {
      pageNum,
      totalCount: data.totalCount,
      articles: data.contents,
    },
  }
}

export default Home
