// Placeholder start for Steps 1–4 merged setup.jsx
// This code would contain all previous step logic and preview card for Step 4.

export default function BlogSetup() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="bg-white shadow-md border border-gray-200 rounded-2xl p-6">
        <h2 className="text-2xl font-semibold mb-4">Step 4: Blog Preview</h2>
        <p className="text-gray-600">Here’s a visual summary of your blog setup.</p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-4 border rounded-xl shadow-sm">
            <h4 className="font-medium text-sm text-gray-500">Blog Domain</h4>
            <p className="text-lg font-semibold text-blue-700">example.cybev.io</p>
          </div>

          <div className="p-4 border rounded-xl shadow-sm">
            <h4 className="font-medium text-sm text-gray-500">Blog Title</h4>
            <p className="text-lg font-semibold text-gray-800">Living Faith Daily</p>
          </div>

          <div className="p-4 border rounded-xl shadow-sm">
            <h4 className="font-medium text-sm text-gray-500">Category & Niche</h4>
            <p className="text-md text-gray-800">Christianity – Devotionals</p>
          </div>

          <div className="p-4 border rounded-xl shadow-sm">
            <h4 className="font-medium text-sm text-gray-500">SEO Description</h4>
            <p className="text-sm text-gray-700">Discover insights and updates...</p>
          </div>

          <div className="p-4 border rounded-xl shadow-sm">
            <h4 className="font-medium text-sm text-gray-500">Selected Template</h4>
            <img src="/templates/simple.png" alt="Template Preview" className="mt-2 rounded w-full h-36 object-contain border" />
          </div>

          <div className="p-4 border rounded-xl shadow-sm">
            <h4 className="font-medium text-sm text-gray-500">Logo Preview</h4>
            <img src="/logo-preview.png" alt="Logo" className="mt-2 h-16 w-auto rounded bg-white shadow" />
          </div>

          <div className="p-4 border rounded-xl shadow-sm">
            <h4 className="font-medium text-sm text-gray-500">Monetization</h4>
            <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Enabled</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button className="px-4 py-2 bg-gray-200 rounded">Back</button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Proceed to Hosting</button>
      </div>
    </div>
  );
}
