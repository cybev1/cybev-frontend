
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

export default function Navbar() {
  const [username, setUsername] = useState('User');

  useEffect(() => {
    const storedName = localStorage.getItem('cybev_username') || 'User';
    setUsername(storedName);
  }, []);

  return (
    <div className="w-full p-4 flex justify-between items-center bg-white dark:bg-black shadow-md">
      <Link href="/" className="text-xl font-bold text-blue-600 dark:text-white">CYBEV</Link>

      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-50 focus:outline-none">
            {username}
            <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
          </Menu.Button>
        </div>
        <Transition as={Fragment}>
          <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-900 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
            <div className="py-1">
              <Menu.Item>
                <Link href="/studio/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">Profile</Link>
              </Menu.Item>
              <Menu.Item>
                <Link href="/studio/dashboard" className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">Dashboard</Link>
              </Menu.Item>
              <Menu.Item>
                <Link href="/studio/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">Settings</Link>
              </Menu.Item>
              <Menu.Item>
                <Link href="/logout" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700">Logout</Link>
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
