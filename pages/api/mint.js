import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const form = new formidable.IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Form parsing failed' });

    const title = fields.title;
    const media = files.media;

    // Simulated IPFS + minting
    const fakeCID = 'bafybeifakecid123456789';
    const fakeTx = '0xabc123fakeTransactionHash';
    const tokenId = Math.floor(Math.random() * 10000);

    // Simulated response
    return res.status(200).json({
      success: true,
      cid: fakeCID,
      tx: fakeTx,
      tokenId,
      title,
    });
  });
}