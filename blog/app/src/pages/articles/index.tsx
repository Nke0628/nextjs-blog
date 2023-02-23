import { Inter } from '@next/font/google'
import { InferGetStaticPropsType, NextPage } from 'next'
import SubHeading from '@/components/layout/SubHeading'
import ArticleCardList from '@/components/template/ArticleCardList'
import { client } from '@/modules/client'
import { articles, categorie } from '@/types/type'

const inter = Inter({ subsets: ['latin'] })

type Props = {
  articles: articles
  category: categorie
}

const Articles: NextPage<
  InferGetStaticPropsType<typeof getServerSideProps>
> = ({ articles, category }: Props) => {
  return (
    <>
      <SubHeading text={'「' + category.name + '」の結果'}></SubHeading>
      <div className="mx-auto md:px-5 py-12 md:max-w-5xl">
        <ArticleCardList articles={articles}></ArticleCardList>
      </div>
    </>
  )
}

export const getServerSideProps = async (context: {
  query: { category_id: string }
}) => {
  const { category_id } = context.query
  const articleDataList = await client.get({
    endpoint: 'articles',
    queries: { filters: `categories[contains]${category_id}`, depth: 1 },
  })
  const categoryData = await client.get({
    endpoint: 'categories',
    queries: { filters: `id[contains]${category_id}` },
  })
  return {
    props: {
      articles: articleDataList.contents,
      category: categoryData.contents[0],
    },
  }
}

export default Articles
