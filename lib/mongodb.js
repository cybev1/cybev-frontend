// lib/mongodb.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
// Optional: set a DB name here if you like: process.env.MONGODB_DB
const options = {};

if (!uri) {
  throw new Error('Please add MONGODB_URI to your environment variables');
}

// In Vercel lambdas, cache the client across invocations
let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
