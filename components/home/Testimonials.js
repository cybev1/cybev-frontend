export default function Testimonials() {
  return (
    <section className="bg-gray-100 px-6 py-12 animate-slide-up">
      <h2 className="text-3xl font-bold text-center mb-6">What People Are Saying</h2>
      <div className="max-w-4xl mx-auto space-y-6">
        <blockquote className="p-4 bg-white shadow rounded">
          <p className="italic">"CYBEV helped me launch my brand without knowing how to code!"</p>
          <footer className="text-sm text-right text-blue-700">– Alex, Digital Creator</footer>
        </blockquote>
        <blockquote className="p-4 bg-white shadow rounded">
          <p className="italic">"The integration of blogging, AI, and Web3 is simply genius."</p>
          <footer className="text-sm text-right text-blue-700">– Naomi, NFT Blogger</footer>
        </blockquote>
      </div>
    </section>
  );
}