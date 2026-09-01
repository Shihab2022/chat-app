import { NextFunction, Request, Response } from 'express';
import sendResponse from '../../../utils/sentResponce';
import httpStatus from 'http-status';
import { CallServices } from './call.services';
import { callServiceMessages, callStatus, callType } from '../../../constant';
import AppError from '../../error/appError';

const getCallHistory = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) => {
  try {
    const currentUserId = req.user?.id;
    const peerId = (req.query?.peerId as string) || undefined;
    if (!currentUserId) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'User is not found');
    }
    const result = await CallServices.getCallHistory({ currentUserId, peerId });
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: callServiceMessages.CALL_HISTORY_GET,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Manual REST logging endpoint (used together with the socket handlers).
 * Lets the client guarantee a call attempt is stored even if the
 * WebSocket path fails mid-flight.
 */
const createCallLog = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) => {
  try {
    const { receiverId, callType: requestedType } = req.body;
    const callerId = req.user?.id;

    if (!callerId) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'User is not found');
    }
    if (!receiverId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        callServiceMessages.RECEIVER_NOT_FOUND,
      );
    }
    if (![callType.AUDIO, callType.VIDEO].includes(requestedType)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        callServiceMessages.INVALID_CALL_TYPE,
      );
    }

    const result = await CallServices.createCallLog({
      callerId,
      receiverId,
      callType: requestedType,
    });
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: callServiceMessages.CALL_CREATED,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateCallLog = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) => {
  try {
    const { callId } = req.params;
    const {
      status: requestedStatus,
      setEndTime = false,
      durationSeconds,
    } = req.body;

    if (!callId) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Call id is required');
    }
    if (
      ![
        callStatus.RECEIVED,
        callStatus.REJECTED,
        callStatus.MISSED,
        callStatus.COMPLETED,
      ].includes(requestedStatus)
    ) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        callServiceMessages.INVALID_CALL_STATUS,
      );
    }

    const result = await CallServices.updateCallLog({
      callId,
      status: requestedStatus,
      setEndTime: Boolean(setEndTime),
      durationSeconds:
        durationSeconds === undefined || durationSeconds === null
          ? null
          : Number(durationSeconds) || 0,
    });
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: callServiceMessages.CALL_UPDATED,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const CallController = {
  getCallHistory,
  createCallLog,
  updateCallLog,
};