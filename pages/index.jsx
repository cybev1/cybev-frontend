import Head from 'next/head'
import Hero from '../components/Hero'
import Features from '../components/Features'
import CallToAction from '../components/CallToAction'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <Head>
        <title>CYBEV – Create, Mint, Earn, Connect</title>
        <meta name="description" content="All-in-one AI-powered platform for creators. Launch blogs, mint NFTs, and earn rewards." />
      </Head>
      <main className="bg-gradient-to-br from-purple-100 via-white to-green-100 min-h-screen overflow-x-hidden relative">
        <Hero />
        <Features />
        <CallToAction />
        <Footer />
        <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-purple-300 opacity-30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-[200px] right-[-200px] w-[500px] h-[500px] bg-green-300 opacity-30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </main>
    </>
  )
}
