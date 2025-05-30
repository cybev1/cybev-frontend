
import Navbar from '../Navbar';
import { useState, useEffect } from 'react';

export default function StudioLayout({ children }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-800 dark:text-gray-200 transition-colors duration-500">
      <Navbar theme={theme} setTheme={setTheme} />
      <main className="pt-20 px-6">{children}</main>
    </div>
  );
}
