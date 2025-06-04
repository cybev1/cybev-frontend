
import { useEffect, useState } from 'react';

export default function HostingSelector() {
  const [plans, setPlans] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function fetchPlans() {
      const res = await fetch('/api/hosting/mock-plans');
      const data = await res.json();
      setPlans(data);
    }
    fetchPlans();
  }, []);

  const handleSelect = (plan) => {
    setSelected(plan);
    alert(`Selected: ${plan.name}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Choose a Hosting Plan</h1>
      {plans.length === 0 && <p>Loading plans...</p>}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, i) => (
          <div
            key={i}
            className={`border p-4 rounded shadow ${
              selected?.name === plan.name ? 'border-blue-600' : ''
            }`}
          >
            <h2 className="text-xl font-semibold text-blue-700">{plan.name}</h2>
            <p className="text-gray-600 my-2">{plan.description}</p>
            <p className="text-lg text-green-600 font-bold mb-2">{plan.price}</p>
            <ul className="text-sm text-gray-700 mb-4 list-disc list-inside">
              {plan.features.map((f, idx) => (
                <li key={idx}>{f}</li>
              ))}
            </ul>
            <button
              onClick={() => handleSelect(plan)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Select
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
