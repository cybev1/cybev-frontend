export default function GreetingWeatherStrip() {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex justify-between items-center mb-4">
      <div className="text-lg font-semibold">Good morning, User!</div>
      <div className="flex items-center space-x-2">
        <span>72°F</span>
        <span>Sunny</span>
      </div>
    </div>
  );
}
