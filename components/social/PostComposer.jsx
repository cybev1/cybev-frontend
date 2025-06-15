import { useState } from 'react';

export default function PostComposer() {
  const [text, setText] = useState('');
  const handlePost = () => {
    alert('Posted: ' + text);
    setText('');
  };
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4">
      <textarea
        className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded mb-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
        rows="3"
        placeholder="What's on your mind?"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        onClick={handlePost}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Post
      </button>
    </div>
  );
}
