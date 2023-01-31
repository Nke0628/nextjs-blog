import { Inter } from '@next/font/google'
import { InferGetStaticPropsType, NextPage } from 'next'
import Link from 'next/link'
import SubHeading from '@/components/layout/SubHeading'
import ArticleCard from '@/components/organisms/ArticleCard'
import { client } from '@/modules/client'
import { articles } from '@/types/type'

const inter = Inter({ subsets: ['latin'] })

type Props = {
  articles: articles
}

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  articles,
}: Props) => {
  const toSnsPostedDate = (publiedAt: string) => {
    const posted = new Date(publiedAt)
    const diff = new Date().getTime() - posted.getTime()
    const progress = new Date(diff)
    let result = ''
    if (progress.getUTCFullYear() - 1970) {
      result = progress.getUTCFullYear() - 1970 + '年前'
    } else if (progress.getUTCMonth()) {
      result = progress.getUTCMonth() + 'ヶ月前'
    } else if (progress.getUTCDate() - 1) {
      result = progress.getUTCDate() - 1 + '日前'
    } else if (progress.getUTCHours()) {
      result = progress.getUTCHours() + '時間前'
    } else if (progress.getUTCMinutes()) {
      result = progress.getUTCMinutes() + '分前'
    } else {
      result = 'たった今'
    }
    return result
  }

  return (
    <>
      <SubHeading text="プログラミングブログ"></SubHeading>
      <div className="mx-auto md:px-5 py-12 md:max-w-5xl">
        <ul className="grid gap-6 md:grid-cols-2 md:gap-8">
          {articles.map((article) => (
            <Link key={article.id} href={`/articles/${article.id}`}>
              <ArticleCard
                subTitle="ブログ記事"
                title={article.title}
                footerText={toSnsPostedDate(article.publishedAt)}
              ></ArticleCard>
            </Link>
          ))}
        </ul>
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
