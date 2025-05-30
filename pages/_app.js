
import '../styles/globals.css';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

export default function MyApp({ Component, pageProps }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <Navbar theme={theme} setTheme={setTheme} />
      <Component {...pageProps} theme={theme} setTheme={setTheme} />
    </div>
  );
}
