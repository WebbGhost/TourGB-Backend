import { NextFunction, Request, Response } from 'express';

import { catchAsync } from '../helpers/middlewares';
import User from '../models/userModel';
import AppError from '../utils/appError';

export const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find();
    if (!users) {
      return next(new AppError('No users found', 404));
    }
    res.status(200).json({
      status: 'Success',
      results: users.length,
      users,
    });
  },
);
const filteredObject = (obj, ...allowed) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowed.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};
export const updateMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.password || req.body.passwordConfirm) {
      return next(new AppError('This is not for password change', 400));
    }
    const filteredBody = filteredObject(req.body, 'name', 'email');
    const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'Success',
      updateUser,
    });
  },
);
export const getUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new AppError('No user found with this id', 404));
    }
    res.status(200).json({
      status: 'Success',
      user,
    });
  },
);

export const deleteMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByIdAndUpdate(req.user.id, { active: false });
    if (!user) {
      return next(new AppError('No user found with this id', 404));
    }
    res.status(200).json({
      status: 'Success',
      user: null,
    });
  },
);
