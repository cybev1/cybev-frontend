import { useEffect, useState } from 'react';

export default function SettingsToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const mode = localStorage.getItem('theme') === 'dark';
    setDarkMode(mode);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newMode);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md max-w-xl">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium">Enable Dark Mode</span>
        <label className="inline-flex items-center cursor-pointer">
          <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} className="sr-only" />
          <div className="w-11 h-6 bg-gray-200 rounded-full shadow-inner dark:bg-gray-600">
            <div className={\`w-5 h-5 bg-white rounded-full shadow transform transition-transform \${darkMode ? 'translate-x-5' : ''}\`}></div>
          </div>
        </label>
      </div>
    </div>
  );
}