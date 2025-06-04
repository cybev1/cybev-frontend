
import { useState } from 'react';

export default function DomainChecker() {
  const [domain, setDomain] = useState('');
  const [status, setStatus] = useState(null);

  const checkDomain = async () => {
    const res = await fetch('/api/domain/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain })
    });
    const data = await res.json();
    setStatus(data.available ? '✅ Domain is available!' : '❌ Domain is not available.');
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-2">Check Domain Availability</h2>
      <input
        type="text"
        className="border p-2 mr-2 rounded"
        placeholder="Enter domain (e.g. myblog.com)"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
      />
      <button onClick={checkDomain} className="bg-blue-600 text-white px-4 py-2 rounded">Check</button>
      {status && <p className="mt-4 text-lg">{status}</p>}
    </div>
  );
}
