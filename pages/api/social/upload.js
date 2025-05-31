
import formidable from 'formidable';
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

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error uploading file' });
    }

    const uploaded = {};
    if (files.image) {
      uploaded.image = `/uploads/${path.basename(files.image[0].filepath)}`;
    }
    if (files.video) {
      uploaded.video = `/uploads/${path.basename(files.video[0].filepath)}`;
    }

    return res.status(200).json({ message: 'Upload successful', ...uploaded });
  });
}
