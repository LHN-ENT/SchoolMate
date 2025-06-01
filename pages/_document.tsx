import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="theme-color" content="#004225" />
        <meta name="application-name" content="SchoolMate" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
