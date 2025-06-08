import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  if (method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    const blog = await db.collection('blogs').findOne({ _id: new ObjectId(id) });
    await client.close();

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    return res.status(200).json({ success: true, blog });
  } catch (error) {
    console.error('Error fetching blog by ID:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}