import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable.');
}
const MONGODB_URI: string = process.env.MONGODB_URI;

// Define the shape of our cache
interface Cache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend the NodeJS global to carry our cache
declare global {
  // use a unique name so we don’t step on mongoose itself
  var _mongoCached: Cache;
}

// Initialize the global cache if needed
const globalAny = global as typeof global & { _mongoCached?: Cache };
if (!globalAny._mongoCached) {
  globalAny._mongoCached = { conn: null, promise: null };
}
const cached: Cache = globalAny._mongoCached;

export async function dbConnect(): Promise<typeof mongoose> {
  // If we've already made a connection, reuse it
  if (cached.conn) {
    return cached.conn;
  }

  // Otherwise, create the promise once
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI)
      .then((mongooseInstance) => mongooseInstance);
  }

  // Await the promise and save the connection for next time
  cached.conn = await cached.promise;
  return cached.conn;
}
