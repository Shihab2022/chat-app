import { NextFunction, Request, Response } from 'express';
import { Secret } from 'jsonwebtoken';
import { jwtVerify } from '../../utils/auth';
import config from '../config';
import httpStatus from 'http-status';
import AppError from '../error/appError';
import { authorizationError, userServiceMessages } from '../../constant';
import { pool } from '../../utils/pg';
// import { NOT_VERIFIED } from '../../constant';

const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const authorizationHeader = req?.headers?.authorization;
      const token = authorizationHeader?.startsWith('Bearer ')
        ? authorizationHeader.slice(7)
        : authorizationHeader;
      if (!token) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          authorizationError.UN_AUTHORIZED,
        );
      }
      const verifyUser = jwtVerify(token, config.jwt_access_secret as Secret);
      if (roles.length && !roles.includes(verifyUser?.role?.toLowerCase())) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          authorizationError.UN_AUTHORIZED,
        );
      }
      const result = await pool.query(
        `SELECT * FROM users WHERE id = $1 LIMIT 1`,
        [verifyUser?.userId],
      );

      const user = result.rows[0];
      if (!user?.is_account_verified) {
        throw new AppError(
          httpStatus.NOT_ACCEPTABLE,
          userServiceMessages.NOT_VERIFIED,
        );
      }
      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
