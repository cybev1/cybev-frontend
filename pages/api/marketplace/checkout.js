
let transactions = [];

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { buyerId, itemId, creator, title, price } = req.body;

  if (!buyerId || !itemId || !creator || !title || !price) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const transaction = {
    id: transactions.length + 1,
    buyerId,
    itemId,
    creator,
    title,
    price: parseFloat(price),
    status: 'Completed',
    purchasedAt: new Date().toISOString(),
  };

  transactions.push(transaction);
  console.log('Marketplace Purchase:', transaction);

  return res.status(200).json({ message: 'Purchase successful', transaction });
}
