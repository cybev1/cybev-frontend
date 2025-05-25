export default function Faq() {
  return (
    <section className="px-6 py-12 animate-fade-in">
      <h2 className="text-3xl font-bold text-center mb-6">Frequently Asked Questions</h2>
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="border p-4 rounded shadow">
          <h4 className="font-semibold">Do I need to know how to code?</h4>
          <p>Nope! CYBEV is fully no-code and beginner friendly.</p>
        </div>
        <div className="border p-4 rounded shadow">
          <h4 className="font-semibold">How do I earn tokens?</h4>
          <p>You earn CYBEV tokens through content creation, engagement, and referrals.</p>
        </div>
        <div className="border p-4 rounded shadow">
          <h4 className="font-semibold">Can I register a custom domain?</h4>
          <p>Yes! CYBEV lets you connect or register your own domain easily.</p>
        </div>
      </div>
    </section>
  );
}