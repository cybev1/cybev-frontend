import { useEffect, useState } from 'react';
export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => { document.documentElement.classList.toggle('dark', dark); }, [dark]);
  return (
    <button onClick={() => setDark(!dark)} className="absolute top-2 right-2 p-2">
      {dark ? '🌙' : '☀️'}
    </button>
  );
}