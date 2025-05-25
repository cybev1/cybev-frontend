import AnimateOnScroll from '../AnimateOnScroll';

export default function Testimonials() {
  const quotes = [
    {
      quote: 'CYBEV helped me launch my brand without knowing how to code!',
      author: '– Alex, Digital Creator'
    },
    {
      quote: 'The integration of blogging, AI, and Web3 is simply genius.',
      author: '– Naomi, NFT Blogger'
    }
  ];

  return (
    <AnimateOnScroll>
      <section className="bg-gray-100 px-6 py-12">
        <h2 className="text-3xl font-bold text-center mb-6">What People Are Saying</h2>
        <div className="max-w-4xl mx-auto space-y-6">
          {quotes.map((q, i) => (
            <blockquote key={i} className="p-4 bg-white shadow rounded">
              <p className="italic">"{q.quote}"</p>
              <footer className="text-sm text-right text-blue-700">{q.author}</footer>
            </blockquote>
          ))}
        </div>
      </section>
    </AnimateOnScroll>
  );
}