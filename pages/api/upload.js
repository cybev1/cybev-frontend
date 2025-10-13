import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  const form = formidable({ multiples: false });
  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).json({ ok: false, error: String(err) });
    return res.status(200).json({ ok: true, fields, files });
  });
}
