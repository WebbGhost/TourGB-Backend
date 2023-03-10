import { NextFunction, Request, Response } from 'express';

import ErrorResponse from '../interfaces/ErrorResponse';
import AppError from '../utils/appError';

export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, max-len
function handleCastError(err: any) {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
}
function handleDublicateError(err: any) {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Dublicate Feild value : at ${value} Please Use another value`;
  return new AppError(message, 400);
}
function handleValidationError(err: any) {
  const errors = Object.values(err.errors).map((e) => e.message);
  const message = `Invalid Input at ${errors.join('. ')}`;
  return new AppError(message, 400);
}
function handleJsonWebTokenError() {
  return new AppError('Inavalid Token please login again', 401);
}
function handleTokenExpiredError(err: any) {
  const message = `Token Has been expired please login again ${err?.message}`;
  return new AppError(message, 401);
}
export function ErrorHandler(
  err: Error,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction,
) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Error';

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    if (err.name === 'CastError') err = handleCastError(err);
    if (err.code === 11000) err = handleDublicateError(err);
    if (err.name === 'ValidationError') err = handleValidationError(err);
    if (err.name === 'JsonWebTokenError') err = handleJsonWebTokenError();
    if (err.name === 'TokenExpiredError') err = handleTokenExpiredError(err);
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
}

export const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};
