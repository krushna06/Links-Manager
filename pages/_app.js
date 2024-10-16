import "@/styles/globals.css";
import Head from 'next/head';
import Link from 'next/link';
import { library } from '@fortawesome/fontawesome-svg-core';
import dynamic from 'next/dynamic';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

const FontAwesomeIcon = dynamic(() =>
  import('@fortawesome/react-fontawesome').then(mod => mod.FontAwesomeIcon), { ssr: false }
);

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
        <meta name="description" content="A simple link manager which helps you store your important links. A project by Krushna Vyas (@n0step_)" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GitHubIcon />
      <Component {...pageProps} />
    </>
  );
}
