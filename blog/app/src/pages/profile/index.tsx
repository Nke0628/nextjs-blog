import { InferGetStaticPropsType, NextPage } from 'next'

import SubHeading from '@/components/layout/SubHeading'

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({}) => {
  return (
    <>
      <SubHeading text="profile"></SubHeading>
      <main className="py-8 md:w-3/5 mx-auto">
        <table className="w-full">
          <tbody className="">
            <tr className="border-t-[1px]">
              <td className="font-bold">Account</td>
              <td className="p-8">
                <div>
                  <a
                    href="https://github.com/Nke0628"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-500"
                  >
                    GitHub
                  </a>
                </div>
                <div>
                  <a
                    href="https://zenn.dev/nk0628"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-500"
                  >
                    Zenn
                  </a>
                </div>
              </td>
            </tr>
            <tr className="border-t-[1px]">
              <td className="font-bold">Job</td>
              <td className="p-8">Software Enginner</td>
            </tr>
            <tr className="border-t-[1px]">
              <td className="font-bold">About</td>
              <td className="p-8">
                <p>Typescript、PHP、Laravel</p>
                <p>
                  バックエンドがメインですが、このブログもNext.jsで書いてます。
                </p>
                <p>開発や設計が好き。</p>
              </td>
            </tr>
          </tbody>
        </table>
      </main>
    </>
  )
}

export const getStaticProps = async () => {
  return {
    props: {},
  }
}

export default Home
