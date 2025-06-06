
import React, { useState } from 'react';

export default function BlogSetup() {
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState({ name: "Basic Plan", price: "$5" });
  const [form, setForm] = useState({ paymentMethod: "paystack" });
  const [showModal, setShowModal] = useState(false);

  const handlePayment = () => {
    setShowModal(false);
    alert("Processing " + form.paymentMethod.toUpperCase() + " payment for " + selectedPlan.name + " (" + selectedPlan.price + ")");
    window.location.href = "/blog/confirm";
  };

  const renderStep = () => {
    if (step === 1) return <div>Step 1: Domain selector and input</div>;
    if (step === 2) return <div>Step 2: Blog identity form</div>;
    if (step === 3) return <div>Step 3: Template selector and monetization</div>;
    if (step === 4) return <div>Step 4: Preview of selected options</div>;
    if (step === 5) return (
      <div>
        <h2 className="text-xl font-bold mb-4">Step 5: Hosting & Payment</h2>
        <button
          onClick={() => {
            setSelectedPlan({ name: "Pro Plan", price: "$10" });
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Pay with Paystack
        </button>

        {showModal && (
          <div className="mt-6 p-4 border rounded bg-gray-100">
            <p>You're about to pay for: {selectedPlan.name}</p>
            <p>Amount: {selectedPlan.price}</p>
            <button onClick={handlePayment} className="mt-4 bg-green-600 text-white px-4 py-2 rounded">Confirm Payment</button>
          </div>
        )}
      </div>
    );
    return <div>Unknown step</div>;
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow rounded">
      {renderStep()}
      <div className="mt-6 flex justify-between">
        {step > 1 && <button onClick={() => setStep(step - 1)} className="px-4 py-2 bg-gray-300 rounded">Back</button>}
        {step < 5 && <button onClick={() => setStep(step + 1)} className="px-4 py-2 bg-blue-600 text-white rounded">Next</button>}
      </div>
    </div>
  );
}
