import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'fallback_secret';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (body.username === 'admin' && body.password === 'admin123') {
    const token = jwt.sign(
      { role: 'admin', user: 'admin' }, 
      SECRET, 
      { expiresIn: '2h' }
    );

    return { token };
  }

  throw createError({ statusCode: 401, message: 'Invalid credentials' });
});