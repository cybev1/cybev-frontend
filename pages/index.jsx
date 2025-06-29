
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="bg-gray-50 dark:bg-black text-gray-900 dark:text-white">
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}
