
import { useEffect, useState } from 'react';

export default function HostingSelector() {
  const [plans, setPlans] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPlans() {
      try {
        const res = await fetch('/api/hosting/whmcs-plans');
        const data = await res.json();
        if (Array.isArray(data)) {
          setPlans(data);
        } else {
          throw new Error("Plans not returned as array");
        }
      } catch (err) {
        setError("Failed to load plans. Please try again.");
        console.error(err);
      }
    }
    fetchPlans();
  }, []);

  const handleSelect = (plan) => {
    setSelected(plan);
    alert(`Selected WHMCS Plan: ${plan.name}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Choose a Hosting Plan (WHMCS)</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {plans.length === 0 && !error && <p className="text-gray-500">Loading plans...</p>}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, i) => (
          <div key={i} className={`border p-4 rounded shadow ${selected?.pid === plan.pid ? 'border-blue-600' : ''}`}>
            <h2 className="text-xl font-semibold text-blue-700">{plan.name}</h2>
            <p className="text-gray-600 my-2">{plan.description || "No description"}</p>
            <button onClick={() => handleSelect(plan)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Select</button>
          </div>
        ))}
      </div>
    </div>
  );
}
