import mongoose from 'mongoose';

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  const config = useRuntimeConfig();
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/xrpl_commons';
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};