import React, { useState } from 'react';
import CreateMenu from '../components/social/CreateMenu';
import GoLiveModal from '../components/social/GoLiveModal';
// ... other imports like LeftNav, RightHub, FeedStream, etc.

export default function Feed() {
  const [goLiveOpen, setGoLiveOpen] = useState(false);

  const handleCreateSelect = (option) => {
    if (option === 'Go Live') {
      setGoLiveOpen(true);
    } else {
      console.log('Navigate to create:', option);
      // TODO: route to respective create pages
    }
  };

  return (
    <div className="flex">
      {/* left nav & right hub omitted for brevity */}
      <main className="flex-1 p-4">
        {/* existing feed UI */}
        {/* ... */}
        {/* Integrate CreateMenu */}
        <CreateMenu onSelect={handleCreateSelect} />
        {/* Go Live Modal */}
        <GoLiveModal isOpen={goLiveOpen} onClose={() => setGoLiveOpen(false)} />
      </main>
    </div>
  );
}
