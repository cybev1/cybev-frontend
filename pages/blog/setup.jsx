
// NOTE: This is a simplified structure to illustrate responsiveness
// Real setup.jsx already includes step logic. This applies polished layouts.

<div className="max-w-5xl mx-auto p-4 sm:p-6">
  <h1 className="text-2xl font-bold mb-6 text-center sm:text-left">CYBEV Blog Setup</h1>

  <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-4 sm:p-6 space-y-6">

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Blog Title</label>
        <input type="text" className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white" placeholder="Enter blog title" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Subdomain</label>
        <input type="text" className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white" placeholder="yourname" />
      </div>
    </div>

    <div className="grid sm:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border rounded-xl p-4 dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-2">Template {i}</h3>
          <div className="w-full h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      ))}
    </div>

    <div className="flex flex-col sm:flex-row gap-4 justify-between">
      <button className="w-full sm:w-auto px-4 py-2 bg-gray-300 rounded">Back</button>
      <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded">Next</button>
    </div>

  </div>
</div>
