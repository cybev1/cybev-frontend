import DashboardLayout from '../../components/DashboardLayout';
import BlogCard from '../../components/BlogCard';

export default function MyBlogsPage() {
  const myBlogs = [
    {
      id: '1',
      title: 'How to Build a Web3 Blog',
      domain: 'web3blog.cybev.io',
      status: 'Published',
      createdAt: '2025-06-15',
    },
    {
      id: '2',
      title: 'The Rise of AI in Content Creation',
      domain: 'aiblogs.cybev.io',
      status: 'Draft',
      createdAt: '2025-06-29',
    },
  ];

  return (
    <DashboardLayout title="My Blogs">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {myBlogs.map(blog => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </DashboardLayout>
  );
}
