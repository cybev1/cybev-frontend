import { useState } from 'react';
import ProfilePage from './profile';
import SettingsPage from './settings';

export default function AccountTabs() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="min-h-screen px-4 md:px-8 py-6 bg-gray-50 dark:bg-black text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">👤 Account Panel</h1>
      <div className="flex space-x-4 border-b border-gray-300 dark:border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab('profile')}
          className={\`px-4 py-2 text-sm font-semibold rounded-t \${activeTab === 'profile' ? 'bg-white dark:bg-gray-800 border-b-2 border-blue-500' : 'text-gray-500'}\`}
        >
          👤 Profile
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={\`px-4 py-2 text-sm font-semibold rounded-t \${activeTab === 'settings' ? 'bg-white dark:bg-gray-800 border-b-2 border-blue-500' : 'text-gray-500'}\`}
        >
          ⚙️ Settings
        </button>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        {activeTab === 'profile' ? <ProfilePage /> : <SettingsPage />}
      </div>
    </div>
  );
}