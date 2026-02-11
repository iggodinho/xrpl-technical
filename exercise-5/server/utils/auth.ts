import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'fallback_secret';

export const verifyAuth = (event: any) => {
  const authHeader = getRequestHeader(event, 'Authorization');
  
  if (!authHeader) {
    throw createError({ statusCode: 401, message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    return decoded;
  } catch (err) {
    throw createError({ statusCode: 403, message: 'Invalid or expired token' });
  }
};