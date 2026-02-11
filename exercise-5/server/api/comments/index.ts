import { connectDB } from '../..//utils/db';
import { Comment } from '../..//models/Comment';

export default defineEventHandler(async (event) => {
  await connectDB();
  if (event.method === 'GET') {
    return await Comment.find().sort({ createdAt: -1 });
  }
  if (event.method === 'POST') {
    const body = await readBody(event);
    if (!body.text) throw createError({ statusCode: 400, message: 'Text is required' });
    const newComment = await Comment.create({
      text: body.text,
      author: 'Anonymous' 
    });
    return newComment;
  }
});