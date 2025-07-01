
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: 'File upload failed' });
      return;
    }
    res.status(200).json({ fields, files });
  });
}
