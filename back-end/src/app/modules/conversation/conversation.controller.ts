import { NextFunction, Request, Response } from "express";
import sendResponse from "../../../utils/sentResponce";
import httpStatus from 'http-Status'
import { InviterUserServices } from "./conversation.services";
// import { MessageServices } from "./message.services";

const InviteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await InviterUserServices.inviteUserIntoDB(req.body)

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Invitation send successfully !!!",
            data: result
        })

    } catch (error) {
        next(error)
    }

}

const getConversation = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const id = req.params.id;
        const result = await InviterUserServices.getConversation(id)

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Conversation get successfully !!!",
            data: result
        })

    } catch (error) {
        next(error)
    }

}


export const InviteUserController = {
    InviteUser,
    getConversation
}