import { GetStaticPaths, InferGetStaticPropsType, NextPage } from 'next'
import { client } from '@/modules/client'
import { article } from '@/types/type'

type Props = {
  article: article
}

const ArticlesId: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  article,
}: Props) => {
  return (
    <main>
      <h1>{article.title}</h1>
      <p>{article.publishedAt}</p>
      <div
        dangerouslySetInnerHTML={{
          __html: `${article.content}`,
        }}
      />
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

export const getStaticProps = async (context) => {
  const id = context.params.id
  const data = await client.get({ endpoint: 'articles', contentId: id })
  return {
    props: {
      article: data,
    },
  }
}

export default ArticlesId
