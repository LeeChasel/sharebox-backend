import mongoose from 'mongoose';
import { env } from './env';

export async function connectToDatabase() {
  await mongoose.connect(env.DB_URL, {
    dbName: env.DB_NAME,
  });
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
}
