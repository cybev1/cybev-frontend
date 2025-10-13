import { useState } from 'react';
import axios from 'axios';
import { Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

export default function MintNFTCard() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [minting, setMinting] = useState(false);
  const [result, setResult] = useState(null);

  const handleMint = async () => {
    if (!file || !title) {
      toast.error('Please provide a title and upload a file.');
      return;
    }

    setMinting(true);
    const formData = new FormData();
    formData.append('media', file);
    formData.append('title', title);

    try {
      const res = await axios.post('/api/mint', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setResult(res.data);
      toast.success('Mint successful!');
    } catch (err) {
      console.error(err);
      toast.error('Minting failed. See console for details.');
    } finally {
      setMinting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 shadow-xl p-6 rounded-2xl w-full max-w-md mx-auto mt-8 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold mb-4">Mint Your Content as NFT</h2>

      <input
        type="text"
        placeholder="Enter title..."
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="w-full p-2 mb-4 rounded border dark:bg-gray-800 dark:text-white"
      />

      <input
        type="file"
        accept="image/*,video/*"
        onChange={e => setFile(e.target.files[0])}
        className="mb-4"
      />

      <button
        onClick={handleMint}
        disabled={minting}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-xl flex justify-center items-center"
      >
        {minting ? (
          <>
            <Loader2 className="animate-spin mr-2 w-4 h-4" />
            Minting...
          </>
        ) : (
          'Mint Now'
        )}
      </button>

      {result && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900 text-sm rounded-xl border border-green-300 dark:border-green-700">
          <CheckCircle className="inline-block text-green-500 mr-2" />
          <span>NFT Minted!</span>
          <ul className="mt-2">
            <li><strong>Token ID:</strong> {result.tokenId}</li>
            <li><strong>TxHash:</strong> <a href={`https://mumbai.polygonscan.com/tx/${result.txHash}`} target="_blank" className="underline text-blue-500">{result.txHash.slice(0, 10)}...</a></li>
            <li><strong>IPFS:</strong> {result.metadataURI}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
