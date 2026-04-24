import { NextFunction, Request, Response } from 'express';
import sendResponse from '../../../utils/sentResponce';
import httpStatus from 'http-Status';
import { MessageServices } from './message.services';
import { messageServiceMessages } from '../../../constant';

const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await MessageServices.sendMessageIntoDB(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: messageServiceMessages.MESSAGE_SEND,
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
      message: messageServiceMessages.MESSAGE_GET,
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
      message: messageServiceMessages.USER_GET,
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
      message: messageServiceMessages.ADD_EMOJI,
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
      message: messageServiceMessages.REMOVE_EMOJI,
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
      message: messageServiceMessages.MESSAGE_EDIT,
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
      message: messageServiceMessages.DELETE_MESSAGE,
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
      message: messageServiceMessages.FORWARD_MESSAGE,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const replyMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await MessageServices.replyMessage(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: messageServiceMessages.REPLY_MESSAGE,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const clearMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await MessageServices.clearMessage(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: messageServiceMessages.CLEAR_MESSAGE,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const deleteAllMessages = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await MessageServices.deleteAllMessages(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: messageServiceMessages.DELETE_MESSAGES,
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
  replyMessage,
  clearMessage,
  deleteAllMessages,
};
