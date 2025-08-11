import { NextFunction, Request, Response } from 'express';
import { Secret } from 'jsonwebtoken';
import { jwtVerify } from '../../utils/auth';
import config from '../config';
import httpStatus from 'http-Status';
import AppError from '../error/appError';
import { User } from '../modules/user/user.model';

const auth = (...roles: string[]) => {
  const errorMessage = 'You are not authorized';
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const token = req?.headers?.authorization;
      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, errorMessage);
      }
      const verifyUser = jwtVerify(token, config.jwt_access_secret as Secret);
      if (roles.length && !roles.includes(verifyUser.role)) {
        throw new AppError(httpStatus.FORBIDDEN, errorMessage);
      }
      const user = await User.findOne(
        { _id: verifyUser?.userId },
        { password: 0 },
      );
      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
