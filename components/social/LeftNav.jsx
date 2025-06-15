import Link from 'next/link';

export default function LeftNav() {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 p-4">
      <nav className="space-y-2">
        <Link href="/feed"><a className="block p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">Home</a></Link>
        <Link href="/studio"><a className="block p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">Studio</a></Link>
        <Link href="/profile"><a className="block p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">Profile</a></Link>
        <Link href="/settings"><a className="block p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">Settings</a></Link>
      </nav>
    </aside>
  );
}
