import { NextFunction, Request, Response } from 'express';
import { promisify } from 'util';
import { catchAsync } from '../helpers/middlewares';
import User from '../models/userModel';
import AppError from '../utils/appError';
import { generateToken, verifyToken } from '../helpers/jwt';

export const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const user = await User.create(req.body);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(
        new AppError(`User already exists with this email ${email}`, 403),
      );
    }
    res.status(200).json({
      status: 'Success',
      user,
    });
  },
);
export const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError('No email or password provided.', 400));
    }
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePasswords(password, user.password))) {
      return next(new AppError('Invalid email or password', 401));
    }
    const token = generateToken(user.id);
    res.status(201).json({
      status: 'Success',
      data: {
        user,
        token,
      },
    });
  },
);

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return next(new AppError('You are not authorized to proceed ', 401));
    }
    const decoded = await verifyToken(token);
    console.log(decoded);
    if (!decoded) {
      return next(new AppError('Validation Token does not match', 401));
    }
    const currentUser = await User.findById(decoded.id);

    if (currentUser?.changePasswordLast(currentUser.iat)) {
      return next(
        new AppError(
          'User changed their password last time please login again',
          401,
        ),
      );
    }
    req.user = currentUser;
    next();
  },
);
