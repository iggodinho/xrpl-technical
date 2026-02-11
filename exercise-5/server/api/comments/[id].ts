import { connectDB } from '../../utils/db';
import { Comment } from '../../models/Comment';
import { verifyAuth } from '../../utils/auth';

export default defineEventHandler(async (event) => {
  await connectDB();
  verifyAuth(event);
  const id = getRouterParam(event, 'id');

  if (event.method === 'DELETE') {
    await Comment.findByIdAndDelete(id);
    return { success: true };
  }

  if (event.method === 'PUT') {
    const body = await readBody(event);
    const updated = await Comment.findByIdAndUpdate(
        id, 
        { text: body.text }, 
        { new: true }
    );
    return updated;
  }
});