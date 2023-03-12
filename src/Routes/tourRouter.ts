import { Router } from 'express';
import {
  createTour,
  deleteTour,
  getAllTours,
  getTour,
  topFiveTours,
  updateTour,
} from '../Controllers/tourController';
import { protect, restriced } from '../Controllers/authController';

const router = Router();
router.route('/top-5-tours').get(protect, topFiveTours);
router.route('/').get(protect, getAllTours).post(protect, createTour);
router
  .route('/:id')
  .get(protect, getTour)
  .patch(protect, restriced('admin', 'lead-guide'), updateTour)
  .delete(protect, restriced('admin', 'lead-guide'), deleteTour);

export default router;
