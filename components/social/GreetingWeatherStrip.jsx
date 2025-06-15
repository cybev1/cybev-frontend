export default function GreetingWeatherStrip() {
  const mockWeather = { temp: 72, icon: '☀️' };
  return (
    <div className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-700">
      <div className="text-lg">Good morning, Prince!</div>
      <div className="flex items-center space-x-2">
        <div className="text-xl font-bold">{mockWeather.temp}°</div>
        <div className="text-sm">{mockWeather.icon}</div>
      </div>
    </div>
  );
}
