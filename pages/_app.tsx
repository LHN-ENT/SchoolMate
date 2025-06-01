import Head from 'next/head'
import { SessionProvider } from 'next-auth/react'
import ErrorBoundary from '@/components/ErrorBoundary'

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#004225" />
      </Head>
      <ErrorBoundary>
        <Component {...pageProps} />
      </ErrorBoundary>
    </SessionProvider>
  )
}

export default MyApp
