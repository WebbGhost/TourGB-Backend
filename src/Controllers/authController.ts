import { NextFunction, Request, Response } from 'express';

import { catchAsync } from '../helpers/middlewares';
import User from '../models/userModel';
import AppError from '../utils/appError';
import { generateToken, verifyToken } from '../helpers/jwt';
import sendEmail from '../utils/email';

export const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const user = await User.create(req.body);
    const existingUser = await User.findOne({ email });
    res.clearCookie('token');
    if (!existingUser) {
      return res.status(200).json({
        status: 'Success',
        user,
      });
    }
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
    const cookieOptions = {
      httpOnly: true,
      expire: new Date((Date.now() + 90) * 24 * 60 * 60 * 1000),
      secure: false,
    };
    user.password = undefined;
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('token', token, cookieOptions).status(201).json({
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
      token = req.cookies.token;
    }
    if (!token) {
      return next(new AppError('You are not authorized to proceed ', 401));
    }
    const decoded = await verifyToken(token);

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
export const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.cookies;
    if (!token) {
      return next(new AppError('No cookie', 401));
    }
    res.clearCookie('token');
    res.status(204).json({
      status: 'Success',
      message: 'Successfully logged out',
    });
  },
);

export const restriced =
  (...roles: [string]) =>
  (req: Request, res: Response, next: NextFunction) => {
    console.log(req.user);
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You are not authorized to perform this action', 403),
      );
    }
    next();
  };

export const forgetPasssword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError(`No user with email ${email} exists `, 402));
    }
    const resetToken = await user.forgertPassswordToken();
    await user.save({ validateBeforeSave: false });

    // Send Email to the user with reset token
    const subject = 'Reset Password Token';
    const url = `${req.protocol}://${req.hostname}/api/v1/users/password-reset/${resetToken}`;
    const text = `${user.name} please use this reset token to reset your password by clicking the link below ${url}`;
    try {
      await sendEmail(email, subject, text);
      res.cookie('resetToken', resetToken).status(200).json({
        status: 'Success',
        message: 'A reset token has been sent to your email address',
      });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(new AppError('Can not send email to the user', 500));
    }
  },
);
export const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { resetToken } = req.params;
    if (!resetToken) {
      return next(
        new AppError('Please send a reset token to reset your password', 403),
      );
    }
    const user = await User.findOne({
      passwordResetToken: resetToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
      return next(
        new AppError('The Token related to user does not exist', 404),
      );
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    const accessToken = generateToken(user.id);
    res
      .cookie('token', accessToken, {
        httpOnly: true,
      })
      .status(201)
      .json({
        status: 'Success',
        data: {
          user,
          accessToken,
        },
      });
  },
);

export const updatePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = await User.findById(id).select('+password');
    if (!user) {
      return next(new AppError('No user found', 404));
    }
    console.log(req.body);
    if (
      !(await user.comparePasswords(req.body.currentPassword, user.password))
    ) {
      return next(new AppError('Your current password is incorrect', 403));
    }
    // if so update the passord
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    const accessToken = generateToken(user.id);
    res
      .cookie('token', accessToken, {
        httpOnly: true,
      })
      .status(201)
      .json({
        status: 'Success',
        data: {
          user,
          accessToken,
        },
      });
  },
);
