import { useRouter } from 'next/router'

const blogDatabase = {
  myblog: {
    title: 'My Blog',
    theme: 'Theme 1',
    description: 'Welcome to My Blog powered by CYBEV.',
    posts: [
      {
        title: 'Hello World!',
        content: 'This is your first post. Edit it in your dashboard and go live!'
      },
      {
        title: 'Next Steps with CYBEV',
        content: 'After launching your blog, share it, mint it, and earn tokens!'
      }
    ]
  },
  techwriter: {
    title: 'TechWriter Digest',
    theme: 'Theme 2',
    description: 'Daily dev tips and Web3 knowledge drops.',
    posts: [
      {
        title: 'Mastering React in 3 Days',
        content: 'Here are the patterns, hooks, and pitfalls you need to know...'
      }
    ]
  }
};

const themes = {
  'Theme 1': 'bg-white text-gray-900',
  'Theme 2': 'bg-gray-900 text-white',
  'Theme 3': 'bg-blue-50 text-blue-900'
};

export default function Site() {
  const { query } = useRouter();
  const blog = blogDatabase[query.subdomain];
  const themeStyle = blog ? themes[blog.theme] : 'bg-red-100 text-red-800';

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100 text-red-800 p-8">
        <h1 className="text-2xl font-bold">404: Blog Not Found</h1>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${themeStyle}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-2">{blog.title}</h1>
        <p className="text-lg mb-6">{blog.description}</p>

        <div className="space-y-6">
          {blog.posts.map((post, i) => (
            <div key={i} className="p-4 border rounded shadow bg-opacity-60">
              <h2 className="text-2xl font-semibold">{post.title}</h2>
              <p className="mt-2 text-base">{post.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}