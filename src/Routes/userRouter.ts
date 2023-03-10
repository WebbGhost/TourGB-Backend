import { Router } from 'express';
import { createUser, loginUser } from '../Controllers/authController';

const router = Router();

router.route('/signup').post(createUser);
router.route('/login').post(loginUser);

export default router;
