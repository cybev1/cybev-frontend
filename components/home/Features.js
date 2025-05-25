export default function Features() {
  return (
    <section className="px-6 py-12 animate-fade-in">
      <h2 className="text-3xl font-bold text-center mb-8">What Can You Do with CYBEV?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
        <div className="p-6 border rounded shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">Create Smart Blogs</h3>
          <p>Build stunning, AI-assisted blogs and websites with ease.</p>
        </div>
        <div className="p-6 border rounded shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">Monetize Content</h3>
          <p>Earn CYBEV tokens for engagement, shares, and activity.</p>
        </div>
        <div className="p-6 border rounded shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">Mint & Share NFTs</h3>
          <p>Turn your blog posts into digital assets instantly.</p>
        </div>
      </div>
    </section>
  );
}