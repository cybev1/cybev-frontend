import AnimateOnScroll from './AnimateOnScroll';

export default function Features() {
  const features = [
    {
      title: 'Create Smart Blogs',
      desc: 'Build stunning, AI-assisted blogs and websites with ease.',
      image: 'https://source.unsplash.com/featured/?writing'
    },
    {
      title: 'Monetize Content',
      desc: 'Earn CYBEV tokens for engagement, shares, and activity.',
      image: 'https://source.unsplash.com/featured/?cryptocurrency'
    },
    {
      title: 'Mint & Share NFTs',
      desc: 'Turn your blog posts into digital assets instantly.',
      image: 'https://source.unsplash.com/featured/?blockchain'
    }
  ];

  return (
    <section className="px-6 py-12">
      <h2 className="text-3xl font-bold text-center mb-8">What Can You Do with CYBEV?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
        {features.map((f, i) => (
          <AnimateOnScroll key={i} delay={i * 0.1}>
            <div className="p-6 border rounded shadow hover:shadow-lg transition bg-white">
              <img src={f.image} alt={f.title} className="w-full h-40 object-cover rounded mb-4" />
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          </AnimateOnScroll>
        ))}
      </div>
    </section>
  );
}
