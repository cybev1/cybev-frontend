
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [username, setUsername] = useState('Creator');
  const [profilePic, setProfilePic] = useState('/avatar.png');

  useEffect(() => {
    const name = localStorage.getItem('cybev_username');
    const photo = localStorage.getItem('cybev_user_photo');
    if (name) setUsername(name);
    if (photo) setProfilePic(photo);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  return (
    <div className="w-full bg-white dark:bg-gray-900 shadow-md fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/">
            <h1 className="text-xl font-bold text-blue-600 dark:text-white cursor-pointer">CYBEV</h1>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-sm text-gray-700 dark:text-gray-300 font-medium">Welcome, {username}</span>
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button className="inline-flex justify-center w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-700">
                <Image src={profilePic} alt="Avatar" width={40} height={40} className="rounded-full" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => router.push('/studio/profile')}
                          className={`${
                            active ? 'bg-gray-100 dark:bg-gray-700' : ''
                          } block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 w-full text-left`}
                        >
                          👤 View Profile
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => router.push('/studio/settings')}
                          className={`${
                            active ? 'bg-gray-100 dark:bg-gray-700' : ''
                          } block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 w-full text-left`}
                        >
                          ⚙️ Settings
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`${
                            active ? 'bg-gray-100 dark:bg-gray-700' : ''
                          } block px-4 py-2 text-sm text-red-600 dark:text-red-400 w-full text-left`}
                        >
                          🚪 Logout
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
}
