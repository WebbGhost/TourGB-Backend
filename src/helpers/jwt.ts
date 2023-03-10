import jwt from 'jsonwebtoken';

export const generateToken = (id: string) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
export const verifyToken = (token: string) =>
  jwt.verify(token, process.env.JWT_SECRET);
