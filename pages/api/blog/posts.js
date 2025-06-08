export default function handler(req, res) {
  const { host } = req.query;

  // Mocked posts for demonstration
  const posts = [
    {
      _id: 'p001',
      title: 'Welcome to Our Blog',
      description: 'This is a short intro post.',
      slug: 'welcome-to-our-blog',
      content: '<p>This is a sample blog post for the host <strong>' + host + '</strong>.</p>',
    },
    {
      _id: 'p002',
      title: 'Getting Started Guide',
      description: 'Learn how to start blogging on CYBEV.',
      slug: 'getting-started-guide',
      content: '<p>Follow these steps to create amazing content for your readers.</p>',
    }
  ];

  return res.status(200).json({ success: true, posts });
}