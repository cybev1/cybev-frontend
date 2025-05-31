
let socialPosts = [];

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(socialPosts.reverse());
  }

  if (req.method === 'POST') {
    const { user, content, image, video } = req.body;

    if (!content || !user) {
      return res.status(400).json({ message: 'Content and user are required' });
    }

    const newPost = {
      id: Date.now(),
      user,
      content,
      image: image || '',
      video: video || '',
      views: Math.floor(Math.random() * 1000),
      likes: 0,
      comments: 0,
      tips: 0,
    };

    socialPosts.push(newPost);
    return res.status(201).json({ message: 'Post created', post: newPost });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
