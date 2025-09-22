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
const addEmoji = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await MessageServices.addEmoji(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Add emoji  successfully !!!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const removeEmoji = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await MessageServices.removeEmoji(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Remove emoji  successfully !!!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const editMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await MessageServices.editMessage(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Remove emoji  successfully !!!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const deleteMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await MessageServices.deleteMessage(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Remove emoji  successfully !!!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const ForwardMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await MessageServices.ForwardMessage(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Forward message successfully !!!',
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
  addEmoji,
  removeEmoji,
  editMessage,
  deleteMessage,
  ForwardMessage,
};
