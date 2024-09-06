import { Request, Response, NextFunction } from "express";
// import httpStatus from "http-status";
import { appName } from ".";
import { pgRequest } from "../utils/postgres";
export const testingRoute = async (req: Request, res: Response) => {
    const query = 'Select * from users'
    const responce = await pgRequest(query)
    res.send({
        message: `Hi Guys, Welcome to ${appName} Server !`,
        responce
    });
};


export const notFound = (req: Request, res: Response, next: NextFunction): any => {
    return res.status(404).json({
        success: false,
        message: "Api not found ",
        error: {
            // path: req.originUrl,
            message: "Your requested path is  not found"

        }
    })
}