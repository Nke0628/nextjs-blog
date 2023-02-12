import { Inter } from '@next/font/google'
import { InferGetStaticPropsType, NextPage } from 'next'
import SubHeading from '@/components/layout/SubHeading'
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
      <SubHeading text="profile"></SubHeading>
      <main className="py-8 md:w-3/5 mx-auto">
        <table className="w-full">
          <tbody className="">
            <tr className="border-t-[0.5px]">
              <td className="font-bold">Job</td>
              <td className="p-8">Software Enginner</td>
            </tr>
            <tr className="border-t-[0.5px]">
              <td className="font-bold">🖥　Job</td>
              <td className="p-8">Software Enginner</td>
            </tr>
            <tr className="border-t-[0.5px]">
              <td className="font-bold">👨　About</td>
              <td className="p-8">
                PHP、Typescript。
                <br />
                バックエンドがメインですが、Next.js(React)も勉強中。
                <br />
                コードを書くことが好き。
              </td>
            </tr>
          </tbody>
        </table>
      </main>
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
