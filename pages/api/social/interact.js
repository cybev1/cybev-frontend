
let socialPosts = [];

export default function handler(req, res) {
  const { id, type, value } = req.body;

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const postIndex = socialPosts.findIndex((p) => p.id === id);
  if (postIndex === -1) {
    return res.status(404).json({ message: 'Post not found' });
  }

  if (type === 'like') {
    socialPosts[postIndex].likes += 1;
  } else if (type === 'comment') {
    socialPosts[postIndex].comments += 1;
  } else if (type === 'tip') {
    socialPosts[postIndex].tips += Number(value || 1);
  } else {
    return res.status(400).json({ message: 'Invalid interaction type' });
  }

  return res.status(200).json({ message: 'Interaction recorded', post: socialPosts[postIndex] });
}
