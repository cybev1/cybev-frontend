// MongoDB connection utility for Next.js API routes
// Note: This is a placeholder since your backend handles MongoDB

let cached = global.mongo;

if (!cached) {
  cached = global.mongo = { conn: null, promise: null };
}

async function connectToDatabase() {
  // Since you're using a separate backend, this just returns a mock connection
  // Your actual MongoDB connection is in your backend server
  
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = Promise.resolve({
      isConnected: true,
      message: 'Using backend API for database operations'
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;

// Helper to check if MongoDB is available
export const isMongoAvailable = () => {
  // Always return true since backend handles it
  return true;
};

// Mock database operations - these should use your backend API instead
export const mockDb = {
  collection: (name) => ({
    find: async () => [],
    findOne: async () => null,
    insertOne: async (doc) => ({ insertedId: 'mock-id' }),
    updateOne: async () => ({ modifiedCount: 1 }),
    deleteOne: async () => ({ deletedCount: 1 }),
  }),
};
