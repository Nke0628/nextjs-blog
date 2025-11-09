// import '@/styles/globals.css']
import type { AppProps } from 'next/app'

import Container from '@/components/layout/Container'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import { ThemeProvider } from '@/contexts/ThemeContext'
import '@/styles/index.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Container>
        <Header></Header>
        <Component {...pageProps} />
        <Footer></Footer>
      </Container>
    </ThemeProvider>
  )
}
