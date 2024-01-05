import { NextFunction, Request, Response } from "express";
import sendResponse from "../../../utils/sentResponce";
import httpStatus from 'http-Status'
import { UserServices } from "./user.services";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('req', req.body)
        const result = await UserServices.createStudentIntoDB(req.body)

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

export const UserController = {
    createUser
}