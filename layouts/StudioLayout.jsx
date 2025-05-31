
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

export default function StudioLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          className="bg-blue-600 text-white p-2 rounded"
          onClick={() => setSidebarOpen(!isSidebarOpen)}
        >
          ☰
        </button>
      </div>
      {isSidebarOpen && (
        <div className="fixed top-0 left-0 w-3/4 h-full z-40 bg-white dark:bg-gray-900 shadow-lg">
          <Sidebar />
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 ml-0 md:ml-64 p-4">{children}</main>
    </div>
  );
}
