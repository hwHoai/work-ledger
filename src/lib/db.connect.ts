// lib/dbConnect.ts
import mongoose from 'mongoose';
import { mongoConnectionString } from '~/config/mongo.config';

const MONGODB_URI = mongoConnectionString;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
// Extend the NodeJS global type to include mongoose
declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: typeof import('mongoose') | null;
    promise: Promise<typeof import('mongoose')> | null;
  };
}

let cached = global.mongoose;

if (!cached) {
  cached = { conn: null, promise: null };
  global.mongoose = cached;
}

async function dbConnect() {
  if (cached?.conn) {
    console.log('Using cached database connection');
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('New database connection established');
      return mongooseInstance;
    });
  }

  try {
    if (cached === undefined) throw new Error('Cached mongoose is undefined');
    cached.conn = await cached.promise;
  } catch (e) {
    if (cached === undefined) throw new Error('Cached mongoose is undefined');
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
