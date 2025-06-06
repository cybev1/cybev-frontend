
import React, { useState } from 'react';

export default function BlogSetup() {
  const [step, setStep] = useState(5);
  const [form, setForm] = useState({
    paymentMethod: '',
    hostingPlan: '',
  });
  const [selectedPlan, setSelectedPlan] = useState({ name: 'Basic Plan', price: 5 });
  const handlePayment = () => {
    alert(
      "Processing " +
      form.paymentMethod.toUpperCase() +
      " payment for " +
      selectedPlan.name +
      " ($" +
      selectedPlan.price +
      ")"
    );
  };

  return (
    <div className="p-6 text-center">
      <h1 className="text-xl font-bold mb-2">Step 5: Hosting & Payment</h1>
      <button onClick={handlePayment} className="bg-green-600 text-white px-4 py-2 rounded">
        Pay with {form.paymentMethod || "Paystack"}
      </button>
    </div>
  );
}
