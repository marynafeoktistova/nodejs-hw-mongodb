import { User } from '../db/models/user.js';
import { Session } from '../db/models/session.js';
import createError from 'http-errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getEnvVar } from '../utils/getEnvVar.js';

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return {
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw createError(401, 'Invalid email or password');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw createError(401, 'Invalid email or password');

  // Remove old session if exists
  await Session.findOneAndDelete({ userId: user._id });

  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  const refreshTokenValidUntil = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000,
  ); // 30 days

  const accessToken = jwt.sign(
    { userId: user._id },
    getEnvVar('ACCESS_SECRET'),
    { expiresIn: '15m' },
  );

  const refreshToken = jwt.sign(
    { userId: user._id },
    getEnvVar('REFRESH_SECRET'),
    { expiresIn: '30d' },
  );

  const session = await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return {
    accessToken,
    refreshToken,
    sessionId: session._id.toString(),
  };
};

export const refreshSession = async (oldRefreshToken) => {
  if (!oldRefreshToken) throw createError(401, 'Refresh token missing');

  let payload;
  try {
    payload = jwt.verify(oldRefreshToken, getEnvVar('REFRESH_SECRET'));
  } catch {
    throw createError(401, 'Invalid or expired refresh token');
  }

  const session = await Session.findOne({ refreshToken: oldRefreshToken });
  if (!session) throw createError(401, 'Session not found');

  // Remove old session
  await Session.deleteOne({ _id: session._id });

  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
  const refreshTokenValidUntil = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000,
  );

  const newAccessToken = jwt.sign(
    { userId: payload.userId },
    getEnvVar('ACCESS_SECRET'),
    { expiresIn: '15m' },
  );

  const newRefreshToken = jwt.sign(
    { userId: payload.userId },
    getEnvVar('REFRESH_SECRET'),
    { expiresIn: '30d' },
  );

  const newSession = await Session.create({
    userId: payload.userId,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return {
    accessToken: newAccessToken,
    newRefreshToken,
    sessionId: newSession._id.toString(),
  };
};

export const logoutService = async (sessionId) => {
  const deletedSession = await Session.findByIdAndDelete(sessionId);

  if (!deletedSession) {
    throw createError(401, 'Session not found or already logged out');
  }
};
