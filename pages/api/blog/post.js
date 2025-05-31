
let mockDB = [
  {
    id: '1',
    title: 'Welcome to my blog',
    seoTitle: 'Welcome to my blog',
    seoDescription: 'My first blog post on CYBEV',
    content: 'This is the body of the first post.',
    category: 'Christianity',
    tags: 'faith, hope',
    mint: false,
    scheduleDate: '2025-05-01T10:00',
  },
  {
    id: '2',
    title: 'Second Post - What I Learned Today',
    seoTitle: 'What I Learned Today',
    seoDescription: 'Summary of lessons and insights.',
    content: 'This is another great post.',
    category: 'Motivation',
    tags: 'growth, learning',
    mint: true,
    scheduleDate: '2025-05-10T09:00',
  }
];

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) return res.status(400).json({ message: 'Post ID required' });

  if (req.method === 'GET') {
    const post = mockDB.find((p) => p.id === id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    return res.status(200).json(post);
  }

  if (req.method === 'PUT') {
    const index = mockDB.findIndex((p) => p.id === id);
    if (index === -1) return res.status(404).json({ message: 'Post not found' });

    mockDB[index] = { ...mockDB[index], ...req.body };
    console.log('Post updated:', mockDB[index]);
    return res.status(200).json({ message: 'Post updated successfully' });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
