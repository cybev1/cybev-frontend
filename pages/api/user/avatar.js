// pages/api/user/avatar.js
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new formidable.IncomingForm({
    uploadDir: path.join(process.cwd(), 'public/uploads'),
    keepExtensions: true,
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error uploading file' });
    }
    const file = files.avatar[0];
    const fileUrl = `/uploads/${path.basename(file.filepath)}`;
    return res.status(200).json({ url: fileUrl });
  });
}
