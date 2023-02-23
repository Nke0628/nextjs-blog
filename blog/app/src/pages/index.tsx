import { Inter } from '@next/font/google'
import { InferGetStaticPropsType, NextPage } from 'next'
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
      <SubHeading text="テックブログ"></SubHeading>
      <div className="mx-auto md:px-5 py-12 md:max-w-5xl">
        <ArticleCardList articles={articles}></ArticleCardList>
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
