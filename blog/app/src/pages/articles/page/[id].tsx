import { Inter } from '@next/font/google'
import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher'
import Pagination from '@/components/atoms/Pagination'
import SubHeading from '@/components/layout/SubHeading'
import ArticleCardList from '@/components/template/ArticleCardList'
import { client } from '@/modules/client'
import { articles } from '@/types/type'

const inter = Inter({ subsets: ['latin'] })

const PAGE_ARTICLE_LIMIT = 5

type Props = {
  pageNum: number
  totalCount: number
  articles: articles
}

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  pageNum,
  totalCount,
  articles,
}: Props) => {
  return (
    <>
      <SubHeading text="articles"></SubHeading>
      <div className="mx-auto md:px-5 py-12 md:max-w-5xl">
        <ArticleCardList articles={articles}></ArticleCardList>
        <div className="mt-10">
          <Pagination
            currentPage={pageNum}
            totalCount={totalCount}
            pageSize={PAGE_ARTICLE_LIMIT}
          />
        </div>
      </div>
    </>
  )
}

export const getStaticPaths = async () => {
  const repos = await client.get({ endpoint: 'articles' })

  const range = (start: number, end: number) =>
    [...Array(end - start + 1)].map((_, i) => start + i)

  const paths = range(1, Math.ceil(repos.totalCount / PAGE_ARTICLE_LIMIT)).map(
    (repo) => `/articles/page/${repo}`,
  )

  return { paths, fallback: false }
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
