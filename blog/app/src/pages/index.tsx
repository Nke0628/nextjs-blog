import { Inter } from '@next/font/google'
import { InferGetStaticPropsType, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
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
    <div>
      <ul>
        {articles.map((article) => (
          <li key={article.id}>
            <Link href={`/blog/${article.id}`}>{article.title}</Link>
          </li>
        ))}
      </ul>
    </div>
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
