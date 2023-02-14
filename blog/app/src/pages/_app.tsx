// import '@/styles/globals.css']
import type { AppProps } from 'next/app'
import Container from '@/components/layout/Container'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import '@/styles/index.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Container>
      <Header></Header>
      <Component {...pageProps} />
      <Footer></Footer>
    </Container>
  )
}
