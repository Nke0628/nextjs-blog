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
      <div className="mx-auto md:px-5 md:max-w-5xl">
        {/* ヒーローセクション */}
        <section className="py-14 md:py-20 grid gap-10 md:grid-cols-2 md:items-center animate-scan-in">
          <div className="px-4 md:px-0">
            <p className="font-mono text-sm text-primary-600 dark:text-primary-400 mb-4">
              $ cat ./about.md
            </p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-ink-900 dark:text-white">
              コードを書き、
              <br />
              <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                記録する。
              </span>
            </h1>
            <p className="mt-5 text-sm md:text-base leading-relaxed text-ink-500 dark:text-ink-300">
              Web開発の実験と学びを綴る個人技術ブログ。
              <br />
              Next.js / TypeScript / その他気になった技術のことを。
            </p>
            <div className="mt-8">
              <Link href={'/articles/page/1'}>
                <button className="group font-mono text-sm inline-flex items-center gap-2 rounded-md border border-primary-500/50 dark:border-primary-400/50 bg-primary-500/5 dark:bg-primary-400/10 hover:bg-primary-500/15 dark:hover:bg-primary-400/20 hover:shadow-glow text-primary-700 dark:text-primary-300 py-2.5 px-5 transition-all duration-300">
                  <span className="text-primary-500 dark:text-primary-400">
                    ❯
                  </span>
                  <span>記事を読む</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </Link>
            </div>
          </div>

          {/* ターミナルウィンドウ */}
          <div className="px-4 md:px-0">
            <div className="rounded-xl border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-900 shadow-soft dark:shadow-glow overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-ink-200 dark:border-ink-800 bg-ink-100 dark:bg-ink-800/60">
                <span className="w-3 h-3 rounded-full bg-accent-400" />
                <span className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="ml-2 font-mono text-xs text-ink-400 dark:text-ink-400">
                  devmane — zsh
                </span>
              </div>
              <div className="p-5 font-mono text-xs md:text-sm leading-7 text-ink-600 dark:text-ink-200">
                <p>
                  <span className="text-emerald-500 dark:text-emerald-400">
                    ➜
                  </span>{' '}
                  <span className="text-primary-600 dark:text-primary-400">
                    ~/devmane
                  </span>{' '}
                  whoami
                </p>
                <p className="text-ink-500 dark:text-ink-300">
                  Webエンジニア / 個人開発者
                </p>
                <p className="mt-2">
                  <span className="text-emerald-500 dark:text-emerald-400">
                    ➜
                  </span>{' '}
                  <span className="text-primary-600 dark:text-primary-400">
                    ~/devmane
                  </span>{' '}
                  ls ./stack
                </p>
                <p className="text-ink-500 dark:text-ink-300">
                  next.js typescript tailwind microcms
                </p>
                <p className="mt-2">
                  <span className="text-emerald-500 dark:text-emerald-400">
                    ➜
                  </span>{' '}
                  <span className="text-primary-600 dark:text-primary-400">
                    ~/devmane
                  </span>{' '}
                  <span className="animate-blink">▍</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 最新記事 */}
        <section className="pb-12">
          <div className="px-4 md:px-0 mb-8 flex items-baseline gap-3">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-ink-900 dark:text-white">
              最新記事
            </h2>
            <span className="font-mono text-xs text-ink-400 dark:text-ink-500">
              {'// latest posts'}
            </span>
          </div>
          <ArticleCardList articles={articles}></ArticleCardList>
          <div className="text-right mt-10 px-4 md:px-0">
            <Link href={'/articles/page/1'}>
              <button className="font-mono text-sm inline-flex items-center gap-2 rounded-md border border-ink-300 dark:border-ink-700 hover:border-primary-400 dark:hover:border-primary-400/60 bg-white/60 dark:bg-ink-900/60 hover:shadow-glow py-2 px-4 text-ink-600 dark:text-ink-300 hover:text-primary-700 dark:hover:text-primary-300 transition-all duration-300">
                <span>記事一覧</span>
                <span>→</span>
              </button>
            </Link>
          </div>
        </section>
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
