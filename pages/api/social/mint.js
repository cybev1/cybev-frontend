
let mintedNFTs = [];

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { postId, user, content, image, video } = req.body;

  if (!postId || !user || !content) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const nft = {
    tokenId: mintedNFTs.length + 1,
    owner: user,
    postId,
    metadata: {
      content,
      image,
      video,
      mintedAt: new Date().toISOString(),
    },
  };

  mintedNFTs.push(nft);
  console.log('NFT Minted:', nft);

  return res.status(200).json({ message: 'Post minted as NFT', nft });
}
