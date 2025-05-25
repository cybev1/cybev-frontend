import AnimateOnScroll from '../AnimateOnScroll';

export default function Faq() {
  const faqs = [
    {
      q: 'Do I need to know how to code?',
      a: 'Nope! CYBEV is fully no-code and beginner friendly.'
    },
    {
      q: 'How do I earn tokens?',
      a: 'You earn CYBEV tokens through content creation, engagement, and referrals.'
    },
    {
      q: 'Can I register a custom domain?',
      a: 'Yes! CYBEV lets you connect or register your own domain easily.'
    }
  ];

  return (
    <section className="px-6 py-12">
      <h2 className="text-3xl font-bold text-center mb-6">Frequently Asked Questions</h2>
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((item, i) => (
          <AnimateOnScroll key={i} delay={i * 0.2}>
            <div className="border p-4 rounded shadow bg-white">
              <h4 className="font-semibold">{item.q}</h4>
              <p>{item.a}</p>
            </div>
          </AnimateOnScroll>
        ))}
      </div>
    </section>
  );
}