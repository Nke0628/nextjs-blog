// import '@/styles/globals.css']
import Container from '@/components/layout/Container'
import Header from '@/components/layout/Header'
import '@/styles/index.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="bg-gray-900 h-screen text-gray-200">
      <Container>
        <Header></Header>
        <Component {...pageProps} />
      </Container>
    </div>
  )
}
