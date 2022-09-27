import type { AppProps } from 'next/app'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'

import { Header } from '../components/Header'

import '../styles/globals.scss'

interface MyAppProps extends AppProps {
  pageProps: {
    session?: Session
  }
}

function MyApp({ Component, pageProps }: MyAppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Header />
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default MyApp
