
import React from 'react';

export default function BlobBackground() {
  return (
    <div className="absolute -z-10 top-0 left-0 w-full h-full overflow-hidden">
      <div className="absolute w-[600px] h-[600px] bg-purple-300 opacity-30 rounded-full blur-3xl animate-pulse top-[-100px] left-[-150px]" />
      <div className="absolute w-[500px] h-[500px] bg-green-300 opacity-20 rounded-full blur-3xl animate-ping top-[300px] right-[-100px]" />
    </div>
  );
}
