import Card from '../components/ui/Card';

export default function Features() {
  const features = [
    {
      title: 'AI Blog Builder',
      desc: 'Create content effortlessly using AI-generated titles, intros, and articles.'
    },
    {
      title: 'Web3 Integration',
      desc: 'Mint posts as NFTs, use tokens, and join the decentralized economy.'
    },
    {
      title: 'Monetization',
      desc: 'Earn CYBEV tokens from blog views, likes, shares, and more.'
    },
    {
      title: 'Templates',
      desc: 'Choose from 100+ blog and website themes with demo content.'
    },
    {
      title: 'Subdomain & Custom Domains',
      desc: 'Instantly publish to your own branded space.'
    }
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-50 text-gray-900">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-blue-900">Platform Features</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          {features.map((item, i) => (
            <Card key={i}>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p>{item.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}