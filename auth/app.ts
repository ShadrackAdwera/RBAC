import { HttpError } from '@adwesh/common';
import express, { Request, Response, NextFunction } from 'express';
import { authRouter } from './routes/auth-routes';

const app = express();

app.use('/api/auth', authRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  return next(new HttpError('This method / route does not exist', 404));
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(error);
  }
  res
    .status(500)
    .json({ message: error.message || 'An error occured, try again' });
});

export { app };
