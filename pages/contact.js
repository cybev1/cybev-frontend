export default function Contact() {
  return (
    <div className="min-h-screen p-6 bg-white text-gray-800">
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-blue-800">Contact Us</h1>
        <p>Have a question, suggestion, or need help? We're here for you!</p>
        <form className="space-y-4">
          <input type="text" placeholder="Your Name" className="w-full px-4 py-2 border rounded" required />
          <input type="email" placeholder="Your Email" className="w-full px-4 py-2 border rounded" required />
          <textarea placeholder="Your Message" rows="4" className="w-full px-4 py-2 border rounded" required></textarea>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Send Message</button>
        </form>
        <p className="text-sm text-gray-600">Or email us directly at <a href="mailto:support@cybev.io" className="text-blue-700 underline">support@cybev.io</a></p>
      </div>
    </div>
  );
}