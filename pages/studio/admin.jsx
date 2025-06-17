
import React from 'react';
import ManageUsersDashboard from '@/components/ManageUsersDashboard';

export default function AdminPage() {
  // This should come from auth context or props
  const currentUser = { role: 'super-admin' };

  return (
    <div className="p-4 dark:bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-white">🛠 Admin Control Panel</h1>
      <ManageUsersDashboard userRole={currentUser.role} />
    </div>
  );
}
