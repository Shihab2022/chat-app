import { NextFunction, Request, Response } from 'express';
import { Secret } from 'jsonwebtoken';
import { jwtVerify } from '../../utils/auth';
import config from '../config';
import httpStatus from 'http-Status';
import AppError from '../error/appError';
import { User } from '../modules/user/user.model';
import { authorizationError, userServiceMessages } from '../../constant';
// import { NOT_VERIFIED } from '../../constant';

const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const token = req?.headers?.authorization;
      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, authorizationError.UN_AUTHORIZED);
      }
      const verifyUser = jwtVerify(token, config.jwt_access_secret as Secret);
      if (roles.length && !roles.includes(verifyUser.role)) {
        throw new AppError(httpStatus.FORBIDDEN, authorizationError.UN_AUTHORIZED);
      }
      const user = await User.findOne(
        { _id: verifyUser?.userId },
        { password: 0 },
      );
      if (!user?.isAccountVerified) {
        throw new AppError(httpStatus.NOT_ACCEPTABLE, userServiceMessages.NOT_VERIFIED);
      }
      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
