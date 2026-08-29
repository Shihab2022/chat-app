import { NextFunction, Request, Response } from 'express';
import sendResponse from '../../../utils/sentResponce';
import httpStatus from 'http-status';
import { MessageServices } from './message.services';
import { messageServiceMessages } from '../../../constant';

const sendMessage = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await MessageServices.sendMessageIntoDB(req.body, req.user);

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

const getMessage = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await MessageServices.getMessageFromDB(req.query as any, req.user);

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
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await MessageServices.getUsersForSidebar(req.query as any, req.user);

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

const addEmoji = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) => {
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

const removeEmoji = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) => {
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

const editMessage = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await MessageServices.editMessage(req.body, req.user);

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
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await MessageServices.deleteMessage(req.body, req.user);

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
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await MessageServices.ForwardMessage(req.body, req.user);

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
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await MessageServices.replyMessage(req.body, req.user);

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
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await MessageServices.clearMessage(req.body, req.user);

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
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await MessageServices.deleteAllMessages(req.body, req.user);

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

const createGroup = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await MessageServices.createGroup(req.body, req.user);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Group created successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const listGroups = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await MessageServices.listGroups(req.query as any, req.user);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Groups retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const addGroupMember = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await MessageServices.addGroupMember({ ...req.body, ...req.params }, req.user);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Member added to group successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const groupDetails = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const result = await MessageServices.getGroup({ ...req.query, ...req.params }, req.user);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Group details retrieved successfully', data: result });
  } catch (error) { next(error); }
};

const groupMembers = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const result = await MessageServices.getGroupMembers({ ...req.query, ...req.params }, req.user);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Group members retrieved successfully', data: result });
  } catch (error) { next(error); }
};

const updateGroup = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const result = await MessageServices.updateGroup({ ...req.body, ...req.params }, req.user);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Group updated successfully', data: result });
  } catch (error) { next(error); }
};

const removeGroupMember = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const result = await MessageServices.removeGroupMember({ ...req.body, ...req.params }, req.user);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Member removed successfully', data: result });
  } catch (error) { next(error); }
};

const setGroupMemberRole = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const result = await MessageServices.setGroupMemberRole({ ...req.body, ...req.params }, req.user);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Member role updated successfully', data: result });
  } catch (error) { next(error); }
};

const leaveGroup = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const result = await MessageServices.leaveGroup({ ...req.body, ...req.params }, req.user);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Left group successfully', data: result });
  } catch (error) { next(error); }
};

const deleteGroup = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const result = await MessageServices.deleteGroup({ ...req.body, ...req.params }, req.user);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Group deleted successfully', data: result });
  } catch (error) { next(error); }
};

const sendGroupMessage = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await MessageServices.sendGroupMessage({ ...req.body, ...req.params }, req.user);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Group message sent successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getGroupMessages = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await MessageServices.getGroupMessages({ ...req.query, ...req.params }, req.user);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Group messages retrieved successfully',
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
  createGroup,
  listGroups,
  addGroupMember,
  groupDetails,
  groupMembers,
  updateGroup,
  removeGroupMember,
  setGroupMemberRole,
  leaveGroup,
  deleteGroup,
  sendGroupMessage,
  getGroupMessages,
};
