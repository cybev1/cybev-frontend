// lib/mongodb.js
import { MongoClient } from 'mongodb';

// Cache across hot-reloads / lambda invocations
let cached = global._mongo;
if (!cached) {
  cached = global._mongo = { client: null, promise: null };
}

/**
 * Get a connected MongoClient (lazy; only checks env at runtime).
 */
export async function getMongoClient() {
  if (cached.client) return cached.client;

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI; // read lazily
    if (!uri) {
      throw new Error('MONGODB_URI is not set in environment variables');
    }
    const client = new MongoClient(uri, {});
    cached.promise = client.connect().then((c) => {
      cached.client = c;
      return c;
    });
  }

  return cached.promise;
}

/**
 * Get a DB reference (default name from env or 'cybev').
 */
export async function getDb(name = process.env.MONGODB_DB || 'cybev') {
  const client = await getMongoClient();
  return client.db(name);
}
