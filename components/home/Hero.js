import AnimateOnScroll from '../AnimateOnScroll';

export default function Hero({ onGetStarted }) {
  return (
    <AnimateOnScroll>
      <section className="min-h-screen flex flex-col justify-center items-center text-center bg-gradient-to-r from-blue-100 to-white px-4 py-16">
        <h1 className="text-5xl font-bold text-blue-900 mb-4">Welcome to CYBEV.IO</h1>
        <p className="text-lg max-w-2xl mb-6">
          The all-in-one AI-powered social Web3 blogging and earning ecosystem.
        </p>
        <button
          onClick={onGetStarted}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg text-xl font-semibold hover:bg-blue-700 transition"
        >
          GET STARTED
        </button>
      </section>
    </AnimateOnScroll>
  );
}