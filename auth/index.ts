import { HttpError } from '@adwesh/common';
import mongoose from 'mongoose';

import { app } from './app';

if (!process.env.MONGO_URI) {
  throw new HttpError('MONGO_URI must be defined', 500);
}

if (!process.env.JWT_KEY) {
  throw new HttpError('JWT_KEY must be defined', 500);
}

const startUp = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    app.listen(5000);
    console.log('Connected to Auth Service, Listening on port: 5000');
  } catch (error) {
    console.log(error);
  }
};

startUp();
