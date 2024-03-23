import { Inter } from '@next/font/google'
import { InferGetStaticPropsType, NextPage } from 'next'
import Link from 'next/link'
import SubHeading from '@/components/layout/SubHeading'
import ArticleCardList from '@/components/template/ArticleCardList'
import { client } from '@/modules/client'
import { articles } from '@/types/type'

const inter = Inter({ subsets: ['latin'] })

type Props = {
  articles: articles
}

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  articles,
}: Props) => {
  return (
    <>
      <SubHeading text="engineering-blog"></SubHeading>
      <div className="mx-auto md:px-5 py-12 md:max-w-5xl">
        <ArticleCardList articles={articles}></ArticleCardList>
        <div className="text-right mt-10">
          <Link href={'/articles/page/1'}>
            <button className="bg-gray-500 py-2 px-4 rounded inline-flex items-center text-white">
              <span>記事一覧 ＞</span>
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
