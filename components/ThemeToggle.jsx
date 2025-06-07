
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('cybev-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const defaultMode = stored !== null ? JSON.parse(stored) : prefersDark;
    setDarkMode(defaultMode);
    document.documentElement.classList.toggle('dark', defaultMode);
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('cybev-theme', JSON.stringify(newMode));
    document.documentElement.classList.toggle('dark', newMode);
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-black dark:text-white shadow"
      title="Toggle Theme"
    >
      {darkMode ? '🌙' : '🌞'}
    </button>
  );
}
