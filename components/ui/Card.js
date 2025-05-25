export default function Card({ children }) {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg p-6 border border-gray-100 hover:border-blue-200 hover:-translate-y-1 transform duration-300">
      {children}
    </div>
  );
}