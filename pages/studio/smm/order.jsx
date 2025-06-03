
import React, { useState, useEffect } from 'react';

export default function SMMOrderForm() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    service: '',
    target: '',
    quantity: 100
  });

  const selected = services.find(s => s.name === form.service);
  const pricePerUnit = selected?.price || 0;
  const total = pricePerUnit * form.quantity;

  useEffect(() => {
    fetch('/api/smm/services.mock.json')
      .then(res => res.json())
      .then(setServices);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/smm/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const result = await res.json();
      alert("✅ Order submitted: $" + result.total);
    } catch (error) {
      alert("❌ Failed to submit order");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🚀 New SMM Order</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Select Service</label>
          <select
            name="service"
            value={form.service}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Choose --</option>
            {services.map((s, i) => (
              <option key={i} value={s.name}>{s.name} – {s.platform}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Target (URL, @handle, etc.)</label>
          <input
            type="text"
            name="target"
            value={form.target}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            min="50"
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mt-4 text-lg">
          <strong>Total:</strong> ${total.toFixed(2)}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Order
        </button>
      </form>
    </div>
  );
}
