import mongoose from 'mongoose';
import config from '../app/config';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.database_url as string);
    // console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log('MongoDB connection error:', error);
  }
};
