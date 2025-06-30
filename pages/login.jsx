export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black">
      <form className="p-8 shadow-md rounded-md bg-[#F0F8FF] w-full max-w-md space-y-4">
        <h1 className="text-xl font-bold text-blue-800">Login to CYBEV</h1>
        <input type="email" placeholder="Email" className="w-full px-4 py-2 border rounded-md" />
        <input type="password" placeholder="Password" className="w-full px-4 py-2 border rounded-md" />
        <button className="w-full bg-blue-700 text-white py-2 rounded-md">Login</button>
      </form>
    </div>
  );
}