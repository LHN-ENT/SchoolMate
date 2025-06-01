import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Primary Meta Tags */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#004225" />
        <title>SchoolMate — Smarter School Admin for Parents</title>
        <meta name="title" content="SchoolMate — Smarter School Admin for Parents" />
        <meta name="description" content="SchoolMate helps busy parents stay on top of school tasks, reminders, and messages with daily digests and smart automation." />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://school-mate-lime.vercel.app/" />
        <meta property="og:title" content="SchoolMate — Smarter School Admin for Parents" />
        <meta property="og:description" content="Daily digests. Smarter school admin. Built for parents." />
        <meta property="og:image" content="https://school-mate-lime.vercel.app/og-image.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://school-mate-lime.vercel.app/" />
        <meta property="twitter:title" content="SchoolMate — Smarter School Admin for Parents" />
        <meta property="twitter:description" content="Stay organised with SchoolMate: digests, reminders, and zero clutter." />
        <meta property="twitter:image" content="https://school-mate-lime.vercel.app/og-image.png" />
      </Head>
      <body className="bg-[#ECECEC] text-[#1E1E1E]">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
