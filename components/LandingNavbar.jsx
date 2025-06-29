
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid'

export default function LandingNavbar() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return (
    <nav className="w-full flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-800 shadow-md fixed top-0 z-50">
      <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-white">
        CYBEV.IO
      </Link>
      <div className="flex items-center space-x-4">
        <Link href="/login" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
          Login
        </Link>
        <Link href="/register" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
          Register
        </Link>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {darkMode ? (
            <SunIcon className="w-5 h-5 text-yellow-400" />
          ) : (
            <MoonIcon className="w-5 h-5 text-gray-800" />
          )}
        </button>
      </div>
    </nav>
  )
}
    