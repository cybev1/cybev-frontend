// pages/studio/groups.jsx
import { useState, useEffect } from 'react';
import GroupCard from '../../components/social/GroupCard';

export default function Groups() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetch('/api/groups')
      .then(res => res.json())
      .then(setGroups)
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-bold">Groups</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {groups.map(g => (<GroupCard key={g.id} group={g} />))}
      </div>
    </div>
  );
}
