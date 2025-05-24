import { useRouter } from 'next/router'

const themes = {
  'Theme 1': 'bg-white text-gray-900',
  'Theme 2': 'bg-gray-900 text-white',
  'Theme 3': 'bg-blue-50 text-blue-900',
  'Theme 4': 'bg-yellow-50 text-yellow-900',
  'Theme 5': 'bg-green-50 text-green-900'
};

export default function BlogPreview() {
  const router = useRouter();
  const { title = 'My Awesome Blog', description = 'Blog powered by CYBEV.', theme = 'Theme 1' } = router.query;
  const themeStyle = themes[theme] || themes['Theme 1'];

  return (
    <div className={`min-h-screen p-8 ${themeStyle}`}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-4">{title}</h1>
        <p className="text-lg mb-6">{description}</p>

        <div className="space-y-6">
          <div className="p-4 border rounded shadow">
            <h2 className="text-2xl font-semibold">Welcome to your first post</h2>
            <p className="mt-2">This is a sample post powered by your selected blog theme and built with CYBEV. You can start publishing immediately after setup!</p>
          </div>
          <div className="p-4 border rounded shadow">
            <h2 className="text-2xl font-semibold">AI + Blockchain = 💥</h2>
            <p className="mt-2">Everything you publish on CYBEV can be minted as NFTs, shared across your network, and monetized with token earnings.</p>
          </div>
        </div>
      </div>
    </div>
  );
}