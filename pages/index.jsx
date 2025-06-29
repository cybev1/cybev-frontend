
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-purple-800 to-pink-600 text-white">
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}
