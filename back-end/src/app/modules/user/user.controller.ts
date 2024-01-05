import { Request, Response } from "express";
import sendResponse from "../../../utils/sentResponce";
import httpStatus from 'http-Status'
import { UserServices } from "./user.services";

const createUser = async (req: Request, res: Response) => {
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
        console.log('error', error)
    }

}

export const UserController = {
    createUser
}