import { body } from 'express-validator';
import express from 'express';
import { login, signUp, getUsers } from '../controllers/auth-controllers';
import { checkAuth } from '@adwesh/common';

const router = express.Router();

router.post(
  '/sign-up',
  [
    body('username').trim().isLength({ min: 3 }),
    body('email').trim().normalizeEmail().isEmail(),
    body('password').trim().isLength({ min: 6 }),
  ],
  signUp
);

router.post(
  '/login',
  [
    body('email').trim().normalizeEmail().isEmail(),
    body('password').trim().isLength({ min: 6 }),
  ],
  login
);

router.use(checkAuth);

router.get('/users', getUsers);

export { router as authRouter };
