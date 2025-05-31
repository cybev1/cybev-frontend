
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Sidebar() {
  const router = useRouter();
  const isActive = (path) => router.pathname === path;

  const menuItems = [
    { icon: '🏠', label: 'Dashboard', href: '/studio/dashboard' },
    { icon: '💼', label: 'Wallet', href: '/studio/wallet' },
    { icon: '🏆', label: 'Super Blogger', href: '/studio/super-blogger' },
    { icon: '🛒', label: 'Marketplace', href: '/studio/marketplace' },
  ];

  return (
    <aside className="w-full md:w-64 bg-white dark:bg-gray-900 p-4 h-screen shadow-lg fixed top-0 left-0">
      <h1 className="text-xl font-bold mb-6 text-center">CYBEV Studio</h1>
      <ul className="space-y-3">
        {menuItems.map(({ icon, label, href }) => (
          <li key={href}>
            <Link href={href}>
              <span className={\`flex items-center px-3 py-2 rounded cursor-pointer transition
                \${isActive(href) ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}\`}>
                {icon} <span className="ml-2">{label}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
