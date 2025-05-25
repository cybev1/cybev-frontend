import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Hero from '../components/home/Hero';
import PromoVideo from '../components/home/PromoVideo';
import Features from '../components/home/Features';
import Testimonials from '../components/home/Testimonials';
import Faq from '../components/home/Faq';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) router.push('/dashboard');
  }, []);

  return (
    <div>
      <Hero onGetStarted={() => router.push('/login')} />
      <PromoVideo />
      <Features />
      <Testimonials />
      <Faq />
    </div>
  );
}