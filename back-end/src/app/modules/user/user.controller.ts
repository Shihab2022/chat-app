import { NextFunction, Request, Response } from 'express';
import sendResponse from '../../../utils/sentResponce';
import httpStatus from 'http-status'; // Correct lowercase
import { UserServices } from './user.services';
import { setTokenOnCookie } from '../../../utils/auth';
import { userControllerMessages } from '../../../constant';

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await UserServices.createUserIntoDB(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: userControllerMessages.USER_CREATED,
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
      message: userControllerMessages.USER_CONFIRMED,
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
      message: userControllerMessages.ACCEPT_INVITE,
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
      message: userControllerMessages.USER_LOGIN,
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
      message: userControllerMessages?.CHECK_EMAIL_RESET_PASSWORD,
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
      message: userControllerMessages.UPDATE_PASSWORD,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await UserServices.checkAuth(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: userControllerMessages?.CHECK_USER,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const sendEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await UserServices.sendEmail(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: userControllerMessages?.EMAIL_SEND,
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
      message: userControllerMessages.INVITE_USER,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const updateUserInfo = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await UserServices.updateUserInfo(req.body, req?.user);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: userControllerMessages.UPDATED_USER,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await UserServices.googleLogin(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: userControllerMessages.GOOGLE_LOGIN,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const googleRegister = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await UserServices.googleRegister(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: userControllerMessages.GOOGLE_REGISTER,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const getFriends = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await UserServices.getFriends(req.user);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: userControllerMessages.GET_FRIENDS,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const blockUser = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await UserServices.blockUser(req.body, req.user);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: userControllerMessages.BLOCK_USER,
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
  sendEmail,
  inviteUser,
  acceptInvite,
  confirmUser,
  updateUserInfo,
  googleLogin,
  googleRegister,
  getFriends,
  blockUser,
};
