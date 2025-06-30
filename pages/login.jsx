import Link from 'next/link';

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full space-y-8 p-10 rounded-xl shadow-lg bg-[#F0F8FF]">
        <h2 className="text-center text-3xl font-bold text-[#1e3a8a]">Login to CYBEV</h2>
        <form className="mt-8 space-y-6">
          <input type="email" placeholder="Email" required className="w-full p-3 border rounded-md" />
          <input type="password" placeholder="Password" required className="w-full p-3 border rounded-md" />
          <button type="submit" className="w-full bg-[#1e3a8a] text-white py-3 rounded-md">Login</button>
        </form>
        <p className="text-center text-sm mt-4">
          Don't have an account? <Link href="/register" className="text-blue-600 underline">Register</Link>
        </p>
      </div>
    </div>
  );
}