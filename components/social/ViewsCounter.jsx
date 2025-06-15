import React from 'react';

export default function ViewsCounter({ views }) {
  return (
    <div className="text-xs text-gray-500 mt-1">
      {views} views
    </div>
  );
}
