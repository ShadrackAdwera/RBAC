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
    password: hashedPassword,
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

const login = async(req: Request, res: Response, next: NextFunction) => {
  const error = validationResult(req);
  if(!error.isEmpty()) {
      return next(new HttpError('Invalid inputs', 422));
  }
  let foundUser;
  let isPassword: boolean;
  let token: string;
  const { email, password } = req.body;

  //check if email exists in the DB
  try {
      foundUser = await User.findOne({email}).exec();
  } catch (error) {
      return next(new HttpError('An error occured, try again', 500));
  }
  if(!foundUser) {
      return next(new HttpError('Email does not exist, sign up instead', 400));
  }

  //compare passwords
  try {
      isPassword = await bcrypt.compare(password, foundUser.password);
  } catch (error) {
      return next(new HttpError('An error occured, try again', 500));
  }

  if(!isPassword) {
      return next(new HttpError('Invalid password', 422));
  }

  //generate token
  try {
      token = await jwt.sign( { id: foundUser.id, email: foundUser.email }, process.env.JWT_KEY!, { expiresIn: '1h' });    
  } catch (error) {
      return next(new HttpError('An error occured, try again', 500));
  }

  res.status(201).json({message: 'Login Successful', user: { id: foundUser.id, email, token, role: foundUser.role }})
}

const getUsers = async(req: Request, res: Response, next: NextFunction) => {
  let foundUsers;
  let currentUser;
  //add middleware to handle this;
  try {
    currentUser = await User.findById(req.user?.userId).exec();
  } catch (error) {
    return next(new HttpError('Internal Server Error', 500));
  }

  if(currentUser?.role !=='Admin') {
    return next(new HttpError('You are not authorized to view this page', 403));
  }


  try {
    foundUsers = await User.find().exec();
  } catch (error) {
    return next(new HttpError('An error occured', 500));
  }

  res.status(200).json({foundUsers});
}

export { signUp, login, getUsers };
