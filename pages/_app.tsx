import '@/styles/globals.css'
import Head from 'next/head'
import { SessionProvider } from 'next-auth/react'

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#004225" />
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default MyApp
