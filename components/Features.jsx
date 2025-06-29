export default function Features() {
  return (
    <section className="py-16 px-4 md:px-10 grid gap-10 md:grid-cols-3 bg-white dark:bg-gray-900">
      <div className="p-6 rounded-lg shadow-lg bg-gradient-to-r from-purple-200 to-purple-100">
        <h3 className="text-xl font-bold">Blog Builder</h3>
        <p>Create & publish blogs with SEO tools and monetization.</p>
      </div>
      <div className="p-6 rounded-lg shadow-lg bg-gradient-to-r from-green-200 to-green-100">
        <h3 className="text-xl font-bold">Mint NFTs</h3>
        <p>Turn your posts into NFTs and earn rewards instantly.</p>
      </div>
      <div className="p-6 rounded-lg shadow-lg bg-gradient-to-r from-blue-200 to-blue-100">
        <h3 className="text-xl font-bold">Creator Dashboard</h3>
        <p>Track views, reactions, staking, and social earnings.</p>
      </div>
    </section>
  )
}
