import "@/styles/globals.css";
import 'font-awesome/css/font-awesome.min.css';
import Head from 'next/head';
import Link from 'next/link';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

library.add(faGithub);

function GitHubIcon() {
  return (
    <Link href="https://github.com/krushna06/Links-Manager" target="_blank" rel="noopener noreferrer">
      <FontAwesomeIcon
        icon={['fab', 'github']}
        style={{
          fontSize: '24px',
          margin: '10px',
          position: 'absolute',
          bottom: '10px',
          left: '5px',
          zIndex: 1000,
          color: '#333',
          height: '40px',
        }}
      />
    </Link>
  );
}

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Links Manager</title>
        <meta name="description" content="Description of my website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GitHubIcon />
      <Component {...pageProps} />
    </>
  );
}
