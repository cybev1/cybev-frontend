import { useState } from 'react';
import ProfileForm from '@/components/ProfileForm';
import SettingsToggle from '@/components/SettingsToggle';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="min-h-screen px-6 py-8 bg-gray-50 dark:bg-black text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
      <div className="mb-4 flex space-x-4">
        <button onClick={() => setActiveTab('profile')} className={\`px-4 py-2 rounded \${activeTab === 'profile' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}\`}>
          👤 Profile
        </button>
        <button onClick={() => setActiveTab('settings')} className={\`px-4 py-2 rounded \${activeTab === 'settings' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}\`}>
          ⚙️ Settings
        </button>
      </div>
      {activeTab === 'profile' && <ProfileForm />}
      {activeTab === 'settings' && <SettingsToggle />}
    </div>
  );
}