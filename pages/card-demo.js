import Card from '../components/ui/Card';

export default function CardDemo() {
  return (
    <div className="min-h-screen p-8 bg-gray-50 text-gray-800">
      <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">Demo of Floating Card UI</h1>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-xl font-semibold mb-2">Modern UI</h3>
          <p>This is a floating card with subtle elevation, consistent padding, and smooth hover effects.</p>
        </Card>
        <Card>
          <h3 className="text-xl font-semibold mb-2">Reusable</h3>
          <p>You can use this Card wrapper around any feature, section, testimonial, or blog preview block.</p>
        </Card>
      </div>
    </div>
  );
}