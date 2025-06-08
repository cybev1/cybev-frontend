export default function handler(req, res) {
  const { slug, host } = req.query;

  // Mocked single post logic
  const post = {
    title: slug === 'getting-started-guide' ? 'Getting Started Guide' : 'Welcome to Our Blog',
    description: slug === 'getting-started-guide'
      ? 'Learn how to start blogging on CYBEV.'
      : 'This is a short intro post.',
    content:
      slug === 'getting-started-guide'
        ? '<p>Follow these steps to create amazing content for your readers.</p>'
        : '<p>This is a sample blog post for the host <strong>' + host + '</strong>.</p>',
  };

  return res.status(200).json({ success: true, post });
}