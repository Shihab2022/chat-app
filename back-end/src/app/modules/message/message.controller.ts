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
// const loginUser = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const result = await UserServices.LoginUserIntoDB(req.body)

//         sendResponse(res, {
//             statusCode: httpStatus.OK,
//             success: true,
//             message: "User login successfully !!!",
//             data: result
//         })

//     } catch (error) {
//         next(error)
//     }

// }
// const forgetPassword = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const result = await UserServices.forgetPassword(req.body)

//         sendResponse(res, {
//             statusCode: httpStatus.OK,
//             success: true,
//             message: "Password is updated successfully !!!",
//             data: result
//         })

//     } catch (error) {
//         next(error)
//     }

// }

export const MessageController = {
    createMessage,
    // loginUser,
    // forgetPassword
}