import { Router } from 'express';
import {
  createTour,
  deleteTour,
  getAllTours,
  getTour,
  topFiveTours,
  updateTour,
} from '../Controllers/tourController';
import { protect } from '../Controllers/authController';

const router = Router();
router.route('/top-5-tours').get(protect, topFiveTours);
router.route('/').get(protect, getAllTours).post(protect, createTour);
router
  .route('/:id')
  .get(protect, getTour)
  .patch(protect, updateTour)
  .delete(protect, deleteTour);

export default router;
