import { Router } from 'express';
import {
  createUser,
  forgetPasssword,
  loginUser,
  logout,
  protect,
  resetPassword,
  restriced,
  updatePassword,
} from '../Controllers/authController';
import {
  deleteMe,
  getAllUsers,
  getUser,
  updateMe,
} from '../Controllers/userController';

const router = Router();

router.route('/signup').post(createUser);
router.route('/login').post(loginUser);
router.route('/logout').post(logout);
router.route('/forget-password').post(forgetPasssword);
router.route('/password-reset/:resetToken').patch(resetPassword);
router.route('/update-password/:id').patch(updatePassword);
router.route('/profile').get(protect, getUser);
router.route('/update-me').patch(protect, updateMe);
router.route('/').get(protect, restriced, getAllUsers);
router.route('/delete-account').delete(protect, deleteMe);

export default router;
