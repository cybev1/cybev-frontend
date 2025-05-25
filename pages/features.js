export default function Features() {
  return (
    <div className="min-h-screen p-6 bg-gray-50 text-gray-900">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-blue-900">Platform Features</h1>
        <ul className="space-y-4 list-disc list-inside">
          <li><strong>AI Blog Builder:</strong> Create content effortlessly using AI-generated titles, intros, and articles.</li>
          <li><strong>Web3 Integration:</strong> Mint posts as NFTs, use tokens, and join the decentralized economy.</li>
          <li><strong>Monetization:</strong> Earn CYBEV tokens from blog views, likes, shares, and more.</li>
          <li><strong>Templates:</strong> Choose from 100+ blog and website themes with demo content.</li>
          <li><strong>Subdomain & Custom Domains:</strong> Instantly publish to your own branded space.</li>
        </ul>
        <img src="https://source.unsplash.com/featured/?technology,features" className="rounded shadow w-full h-64 object-cover" alt="Features" />
      </div>
    </div>
  );
}