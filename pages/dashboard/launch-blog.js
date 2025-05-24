import { useRouter } from 'next/router'

export default function LaunchBlog() {
  const router = useRouter();
  const { title = 'My Blog', description = 'Welcome to my CYBEV site.', domainType = 'subdomain', domainValue = 'myblog', theme = 'Theme 1', category = 'Inspiration' } = router.query;

  const displayDomain = domainType === 'subdomain'
    ? `${domainValue}.cybev.io`
    : domainValue;

  const handleLaunch = () => {
    alert('Blog launched! Subdomain assigned (simulated)');
    router.push(`/blog-preview?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&theme=${encodeURIComponent(theme)}`);
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-xl mx-auto bg-gray-50 p-6 rounded shadow">
        <h1 className="text-2xl font-bold text-blue-900 mb-4">Review & Launch</h1>
        <div className="space-y-3 text-gray-700">
          <p><strong>Title:</strong> {title}</p>
          <p><strong>Description:</strong> {description}</p>
          <p><strong>Domain:</strong> {displayDomain}</p>
          <p><strong>Category:</strong> {category}</p>
          <p><strong>Theme:</strong> {theme}</p>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            onClick={() => router.back()}
            className="flex-1 border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-100"
          >
            Edit Setup
          </button>
          <button
            onClick={handleLaunch}
            className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Launch Blog
          </button>
        </div>
      </div>
    </div>
  );
}