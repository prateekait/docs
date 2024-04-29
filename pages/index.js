import { getSession } from 'next-auth/react';
import Head from 'next/head'
import Center from '../components/Center';
import Player from '../components/Player';
import Sidebar from '../components/Sidebar';

export default function Home() {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <Head>
        <title>2potify - A Spotify Clone</title>
      </Head>
      <main className='flex'>
        <Sidebar />
        <Center />
      </main>
      <footer className='sticky bottom-0'>
        <Player />
      </footer>
    </div>
  )
}

export async function getServerSideProps (context) {
  const session = await getSession(context);
  return {
    props: {
      session
    }
  } 
}
