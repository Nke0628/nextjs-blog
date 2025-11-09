import { InferGetStaticPropsType, NextPage } from 'next'
import Link from 'next/link'

import ArticleCardList from '@/components/template/ArticleCardList'
import { client } from '@/modules/client'
import { articles } from '@/types/type'

type Props = {
  articles: articles
}

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  articles,
}: Props) => {
  return (
    <>
      <div className="mx-auto md:px-5 py-12 md:max-w-5xl">
        <ArticleCardList articles={articles}></ArticleCardList>
        <div className="text-right mt-10">
          <Link href={'/articles/page/1'}>
            <button className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 py-2 px-4 rounded-lg inline-flex items-center text-gray-700 dark:text-gray-300 text-sm font-medium transition-colors duration-200">
              <span>記事一覧 →</span>
            </button>
          </Link>
        </div>
      </div>
    </>
  )
}

export const getStaticProps = async () => {
  const data = await client.get({ endpoint: 'articles' })
  return {
    props: {
      articles: data.contents,
    },
  }
}

export default Home
