
import Head from 'next/head';
import HeroSection from '../components/HeroSection';
import Navbar from '../components/Navbar';
import VoiceWelcome from '../components/VoiceWelcome';
import '../styles/globals.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>CYBEV.IO – AI Web3 Social Platform</title>
      </Head>
      <div className="relative overflow-hidden">
        <div className="blob top-[-100px] left-[-100px]"></div>
        <div className="blob bottom-[-100px] right-[-100px]"></div>
        <Navbar />
        <HeroSection />
        <VoiceWelcome />
      </div>
    </>
  );
}
