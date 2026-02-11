import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: String, default: 'Anonymous' },
  createdAt: { type: Date, default: Date.now }
});

export const Comment = mongoose.models.Comment || mongoose.model('Comment', schema);