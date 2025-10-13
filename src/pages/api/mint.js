import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { ethers } from 'ethers';
import axios from 'axios';

export const config = {
  api: { bodyParser: false },
};

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.MUMBAI_RPC_URL;
const PINATA_API_KEY = '70f773adc7ddfca7b88d';
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;

const abi = [
  "function safeMint(address to, string memory uri) public returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const form = new formidable.IncomingForm({ keepExtensions: true });
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Form parsing failed' });

    const file = files.media;
    const title = fields.title;
    if (!file) return res.status(400).json({ error: 'No media uploaded' });

    const mediaStream = fs.createReadStream(file.filepath);

    try {
      const pinataRes = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        new FormData().append('file', mediaStream),
        {
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          headers: {
            'Content-Type': `multipart/form-data; boundary=${mediaStream._boundary}`,
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_SECRET_API_KEY,
          },
        }
      );

      const cid = pinataRes.data.IpfsHash;
      const metadata = {
        name: title,
        description: "Minted from CYBEV",
        image: `ipfs://${cid}`,
      };

      const metadataRes = await axios.post(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        metadata,
        {
          headers: {
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_SECRET_API_KEY,
          },
        }
      );

      const metadataURI = `ipfs://${metadataRes.data.IpfsHash}`;
      const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
      const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

      const tx = await contract.safeMint(wallet.address, metadataURI);
      const receipt = await tx.wait();
      const tokenId = receipt.events.find(e => e.event === 'Transfer').args.tokenId.toString();

      res.status(200).json({
        success: true,
        cid,
        tokenId,
        txHash: receipt.transactionHash,
        metadataURI
      });
    } catch (error) {
      console.error('Minting Error:', error);
      res.status(500).json({ error: 'Minting failed' });
    }
  });
}