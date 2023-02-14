// import '@/styles/globals.css']
import type { AppProps } from 'next/app'
import Container from '@/components/layout/Container'
import Header from '@/components/layout/Header'
import '@/styles/index.css'
import Footer from '@/components/layout/Footer'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Container>
      <Header></Header>
      <Component {...pageProps} />
      <Footer></Footer>
    </Container>
  )
}
