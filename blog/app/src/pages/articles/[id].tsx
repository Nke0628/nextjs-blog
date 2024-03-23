import { ParsedUrlQuery } from 'querystring'

import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from 'next'
import Link from 'next/link'

import Badge from '@/components/atoms/Badge'
import ArticleTeplate from '@/components/organisms/ArticleTemplate'
import { client } from '@/modules/client'
import { article } from '@/types/type'

type Props = {
  article: article
}

interface Params extends ParsedUrlQuery {
  id: string
}

const ArticlesId: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  article,
}: Props) => {
  return (
    <main className="py-8 md:w-3/5 mx-auto">
      <h1 className="text-center text-3xl font-bold my-3 ">{article.title}</h1>
      <p className="text-right mt-3 mb-9">{article.publishedAt}</p>
      <div className="mx-auto">
        <ArticleTeplate contentHtml={article.content}></ArticleTeplate>
      </div>
      <div className="mt-5">
        {article.categories.map((categorie) => (
          <Link href="/" key={categorie.id}>
            <Badge text={categorie.name}></Badge>
          </Link>
        ))}
      </div>
    </main>
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
}) => {
  const id = params!.id
  const data = await client.get({ endpoint: 'articles', contentId: id })
  return {
    props: {
      article: data,
    },
  }
}

export default ArticlesId
