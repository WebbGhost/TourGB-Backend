import type { Request, Response, NextFunction } from 'express';
import Tour from '../models/tourModel';
import APIFeatures from '../utils/apiFeatures';
import { catchAsync } from '../helpers/middlewares';
import AppError from '../utils/appError';

export const topFiveTours = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  next();
};
export const getAllTours = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .feildLimiting()
      .pagination();

    const tour = await features.query;

    res.status(200).json({
      status: 'success',
      result: tour.length,
      data: {
        tour,
      },
    });
  },
);
export const createTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tour = await Tour.create(req.body);
    res.status(200).json({
      status: 'Success',
      tour,
    });
  },
);

export const getTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return next(new AppError('No tour with this id exists.', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  },
);
export const updateTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!tour) {
      return next(new AppError(`No Tour found for ID ${req.params.id}`, 404));
    }
    res.status(200).json({
      status: 'Success',
      tour,
    });
  },
);
export const deleteTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) {
      return next(new AppError(`No Tour found for ID ${req.params.id}`, 404));
    }
    res.status(201).json({
      status: 'Success',
      message: `Tour ${req.params.id} deleted successfully`,
    });
  },
);

export const getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },

    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        totalPrice: { $sum: '$price' },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        maxPrice: { $max: '$price' },
        minPrice: { $min: '$price' },
        avgPrice: { $avg: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //     $match: { _id: { $ne: 'EASY' } },
    // },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

export const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const { year } = req.params * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: { $gte: new Date(year, 0, 1) },
        endDates: { $lte: new Date(year, 11, 31) },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStart: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStart: -1 },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
