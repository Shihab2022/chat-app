import { NextFunction, Request, Response } from 'express';
import sendResponse from '../../../utils/sentResponce';
import httpStatus from 'http-Status';
import { MessageServices } from './message.services';

const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await MessageServices.sendMessageIntoDB(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Message send successfully !!!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await MessageServices.getMessageFromDB(req.query);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Message get successfully !!!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const getUsersForSidebar = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await MessageServices.getUsersForSidebar(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Users  get successfully !!!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const MessageController = {
  sendMessage,
  getMessage,
  getUsersForSidebar,
};
