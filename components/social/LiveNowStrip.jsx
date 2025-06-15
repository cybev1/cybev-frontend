export default function LiveNowStrip() {
  return (
    <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg shadow flex justify-between items-center mb-4">
      <span className="text-red-700 dark:text-red-300 font-medium">Admin is live now!</span>
      <button className="px-3 py-1 bg-red-600 text-white rounded-lg">Watch</button>
    </div>
  );
}
