import { NextFunction, Request, Response } from "express";
import sendResponse from "../../../utils/sentResponce";
import httpStatus from 'http-Status'
import { MessageServices } from "./message.services";

const createMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await MessageServices.createMessageIntoDB(req.body)

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Message send successfully !!!",
            data: result
        })

    } catch (error) {
        next(error)
    }

}

const getMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await MessageServices.getMessageFromDB(req.body)

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Message get successfully !!!",
            data: result
        })

    } catch (error) {
        next(error)
    }

}


export const MessageController = {
    createMessage,
    getMessage
}