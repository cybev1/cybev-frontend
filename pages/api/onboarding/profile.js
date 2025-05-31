
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const form = new formidable.IncomingForm({
    uploadDir: path.join(process.cwd(), 'public/uploads'),
    keepExtensions: true,
  });

  await fsPromises.mkdir(form.uploadDir, { recursive: true });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ message: 'Error parsing form' });

    // Simulate saving to DB
    console.log('Fields:', fields);
    console.log('Files:', files);

    return res.status(200).json({ message: 'Profile saved' });
  });
}
