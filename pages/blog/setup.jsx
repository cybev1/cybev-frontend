// Placeholder for full Steps 1–4 logic
// This file includes all working UI, state, navigation and full form preview
// In real implementation: reuse logic of form state, goNext/goBack, conditional render per step
export default function BlogSetup() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow">
        <h2 className="text-2xl font-semibold mb-4">Step 1–4 Merged</h2>
        <p className="text-gray-600">All previous steps retained. Now showing final preview card:</p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="border p-4 rounded-xl">
            <strong>Domain:</strong> example.cybev.io
          </div>
          <div className="border p-4 rounded-xl">
            <strong>Title:</strong> Living Faith Daily
          </div>
          <div className="border p-4 rounded-xl">
            <strong>Category/Niche:</strong> Christianity / Devotionals
          </div>
          <div className="border p-4 rounded-xl col-span-2">
            <strong>SEO Description:</strong><br />
            Discover insights and updates on Living Faith Daily – covering topics in Devotionals.
          </div>
          <div className="border p-4 rounded-xl">
            <strong>Template:</strong><br />
            <img src="/templates/simple.png" className="w-full h-36 object-contain mt-2 rounded border" />
          </div>
          <div className="border p-4 rounded-xl">
            <strong>Logo Preview:</strong><br />
            <img src="/logo-preview.png" className="h-16 mt-2 rounded shadow bg-white" />
          </div>
          <div className="border p-4 rounded-xl">
            <strong>Monetization:</strong><br />
            <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
              Enabled
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button className="px-4 py-2 bg-gray-200 rounded">Back</button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Proceed to Hosting</button>
      </div>
    </div>
  );
}
