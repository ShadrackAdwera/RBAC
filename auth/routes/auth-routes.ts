import { body } from 'express-validator';
import express from 'express';
import { signUp } from '../controllers/auth-controllers';

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

export { router as authRouter };
