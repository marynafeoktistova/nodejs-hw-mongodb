import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { getEnvVar } from '../utils/getEnvVar.js';
import { Session } from '../db/models/session.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError(401, 'No token provided');
    }

    const token = authHeader.split(' ')[1];

    let payload;
    try {
      payload = jwt.verify(token, getEnvVar('ACCESS_SECRET'));
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw createError(401, 'Access token expired');
      }
      throw createError(401, 'Invalid token');
    }

    const session = await Session.findOne({ accessToken: token });
    if (!session) {
      throw createError(401, 'Session not found or logged out');
    }

    req.user = { id: payload.userId };
    next();
  } catch (error) {
    next(error);
  }
};
