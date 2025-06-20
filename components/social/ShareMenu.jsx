import { useState } from 'react';
import { ClipboardIcon, ShareIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

export default function ShareMenu({ postId }) {
  const [open, setOpen] = useState(false);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(url);
    toast.success('🔗 Link copied to clipboard!');
  };

  const handleInternalShare = async () => {
    const res = await fetch('/api/posts/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId })
    });

    const data = await res.json();
    if (data.success) toast.success('📣 Shared to your timeline!');
    else toast.error('❌ Failed to share');
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="text-blue-600 flex items-center gap-1 text-sm">
        <ShareIcon className="w-4 h-4" /> Share
      </button>
      {open && (
        <div className="absolute z-50 mt-2 right-0 bg-white dark:bg-gray-900 shadow-lg rounded-xl text-sm w-48 p-2 border dark:border-gray-700">
          <button onClick={handleCopyLink} className="w-full text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
            Copy Link
          </button>
          <button onClick={handleInternalShare} className="w-full text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
            Share to Timeline
          </button>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(window.location.origin + '/post/' + postId)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
          >
            Share on WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}