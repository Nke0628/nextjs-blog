import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="ja">
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="description" content="DevMane - モダンな開発者ブログ" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
