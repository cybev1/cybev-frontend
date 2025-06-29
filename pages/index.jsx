import Head from 'next/head';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Head>
        <title>CYBEV – The Future of Content Creation</title>
      </Head>
      <div className="live-pulse">🔥 10,328 Creators Live Now on CYBEV</div>
      <Hero />
      <Features />
      <Footer />
      <button className="sticky-cta">Join Now</button>
      <style jsx>{`
        .live-pulse {
          text-align: center;
          padding: 0.5rem;
          background: linear-gradient(to right, #ff0080, #7928ca);
          color: white;
          font-weight: bold;
          animation: pulse 1.2s infinite alternate;
        }
        @keyframes pulse {
          from { opacity: 0.8; transform: scale(1); }
          to { opacity: 1; transform: scale(1.05); }
        }
        .sticky-cta {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: #000;
          color: #fff;
          padding: 10px 20px;
          border-radius: 25px;
          z-index: 1000;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }
      `}</style>
    </>
  );
}