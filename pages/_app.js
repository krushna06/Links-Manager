import "@/styles/globals.css";
import 'font-awesome/css/font-awesome.min.css';
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Links Manager</title>
        <meta name="description" content="Description of my website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
