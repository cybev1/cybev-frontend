
// Correct placement and closure of JSX fragment for renderStep5
// You would insert this inside your setup.jsx in the appropriate location

const renderStep5 = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Step 5: Hosting & Publish</h1>
      <p className="text-gray-600 mb-4">Choose a hosting plan or skip this step if you're using a free subdomain.</p>

      {form.domainType !== 'subdomain' && (
        <select
          name="hostingPlan"
          value={form.hostingPlan || ''}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              hostingPlan: e.target.value
            }))
          }
          className="border p-2 rounded w-full mb-4"
        >
          <option value="">Select Hosting Plan</option>
          <option value="Basic">Basic Plan - $5/month</option>
          <option value="Pro">Pro Plan - $10/month</option>
          <option value="Premium">Premium Plan - $20/month</option>
        </select>
      )}

      {form.domainType === 'subdomain' && (
        <p className="text-blue-700 font-semibold mb-4 cursor-pointer underline" onClick={() => {
          console.log('Final Blog Setup:', form);
          alert('🎉 Blog published successfully using free hosting!');
        }}>
          👉 Skip this step and use free hosting
        </p>
      )}

      <div className="flex justify-between mt-6">
        <button onClick={goBack} className="bg-gray-300 text-black px-6 py-2 rounded">Back</button>
        {form.domainType !== 'subdomain' && (
          <button
            onClick={() => {
              console.log('Final Blog Setup:', form);
              alert('🎉 Blog published successfully!');
            }}
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            Publish My Blog
          </button>
        )}
      </div>
    </div>
  );
}
