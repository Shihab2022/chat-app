import { Request, Response } from "express";
import sendResponse from "../../../utils/sentResponce";
import httpStatus from 'http-Status'

const createUser = async (req: Request, res: Response) => {
    try {
        console.log('req', req.body)
        // console.log('request is comming ')
        // res.send({
        //     success: true,
        // })

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "User is created successfully !!!",
            data: req.body
        })

    } catch (error) {
        console.log('error', error)
    }

}

export const UserController = {
    createUser
}