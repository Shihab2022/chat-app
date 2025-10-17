import { NextFunction, Request, Response } from 'express';
import sendResponse from '../../../utils/sentResponce';
import httpStatus from 'http-Status';
import { UserServices } from './user.services';
import { setTokenOnCookie } from '../../../utils/auth';

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await UserServices.createUserIntoDB(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User is created successfully !!!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const confirmUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await UserServices.confirmUser(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User account  confirmed successfully !!!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const acceptInvite = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await UserServices.acceptInvite(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Your account created successfully !!!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await UserServices.LoginUserIntoDB(req.body);
    const token = result?.accessToken;
    setTokenOnCookie(token, res);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User login successfully !!!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const forgetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await UserServices.forgetPassword(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Check your email to reset password !!!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await UserServices.updatePassword(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Password is updated successfully !!!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const checkAuth = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await UserServices.checkAuth(req?.user);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Check User successfully !!!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const inviteUser = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await UserServices.inviteUser(req.body, req?.user);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User is created successfully !!!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
export const UserController = {
  createUser,
  loginUser,
  forgetPassword,
  updatePassword,
  checkAuth,
  inviteUser,
  acceptInvite,
  confirmUser,
};
