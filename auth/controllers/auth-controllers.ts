import { HttpError } from '@adwesh/common';
import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { User } from '../models/User';

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError('Invalid inputs', 422));
  }
  const {
    username,
    email,
    password,
  }: { username: string; email: string; password: string } = req.body;
  let token: string;
  let hashedPassword: string;
  let foundUser;

  try {
    foundUser = await User.findOne({ email }).exec();
  } catch (error) {
    return next(new HttpError('An error occured, try again.', 500));
  }

  if (foundUser) {
    return next(new HttpError('Email exists', 400));
  }

  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(new HttpError('An error occured, try again', 500));
  }
  const newUser = new User({
    username,
    email,
    password,
  });

  try {
    await newUser.save();
  } catch (error) {
    return next(new HttpError('An error occured, try again', 500));
  }

  try {
    token = jwt.sign({ userId: newUser.id, email }, process.env.JWT_KEY!, {
      expiresIn: '1h',
    });
  } catch (error) {
    return next(new HttpError('An error occured, try again', 500));
  }

  res.status(201).json({
    message: 'Sign Up Successful',
    user: { id: newUser.id, email: newUser.email, token },
  });
};

export { signUp };
