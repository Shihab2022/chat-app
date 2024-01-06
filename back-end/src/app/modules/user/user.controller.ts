import { NextFunction, Request, Response } from "express";
import sendResponse from "../../../utils/sentResponce";
import httpStatus from 'http-Status'
import { UserServices } from "./user.services";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await UserServices.createUserIntoDB(req.body)

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "User is created successfully !!!",
            data: result
        })

    } catch (error) {
        next(error)
    }

}
const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await UserServices.LoginUserIntoDB(req.body)

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "User login successfully !!!",
            data: result
        })

    } catch (error) {
        next(error)
    }

}
const forgetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await UserServices.forgetPassword(req.body)

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Password is updated successfully !!!",
            data: result
        })

    } catch (error) {
        next(error)
    }

}

export const UserController = {
    createUser,
    loginUser,
    forgetPassword
}