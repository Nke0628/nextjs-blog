import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="ja">
      <Head>
        <title>Nake</title>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="description" content="Nake's Blog" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
