/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { TErrorSource } from '../interface/error';
import handleCastError from '../error/CastError';
import handleValidationError from '../error/ValidationError';
import handleDuplicateError from '../error/DuplicateError';
import AppError from '../error/appError';
// import { ZodError, ZodIssue } from 'zod';
// import config from '../config';
// import handleZodError from '../errors/ZodError';



const globalErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {

    let statusCode = 500;
    let message = 'Something went wrong !'
    let errorMessage = 'Something went wrong !'
    let stack = error?.stack
    let name
    let errorDetails: TErrorSource = [
        {
            path: '',
            message: 'Something went wrong'
        }
    ]

    // if (error instanceof ZodError) {
    //     const simplifiedError = handleZodError(error)
    //     statusCode = simplifiedError.statusCode as number;
    //     message = simplifiedError.message as string;
    //     errorDetails = simplifiedError.errorDetails
    //     stack = simplifiedError.stack
    //     errorMessage = simplifiedError.errorMessage as string

    // }
    if (error.name === "CastError") {
        const simplifiedError = handleCastError(error)
        statusCode = simplifiedError.statusCode as number;
        message = simplifiedError.message as string;
        errorDetails = simplifiedError.errorDetails
        errorMessage = simplifiedError.errorMessage as string
    }
    else if (error.name === "ValidationError") {

        const simplifiedError = handleValidationError(error)
        statusCode = simplifiedError.statusCode as number;
        message = simplifiedError.message as string;
        errorDetails = simplifiedError.errorDetails
        stack = simplifiedError.stack
        errorMessage = simplifiedError.errorMessage as string
    }

    else if (error.code === 11000) {

        const simplifiedError = handleDuplicateError(error)
        statusCode = simplifiedError.statusCode as number;
        message = simplifiedError.message as string;
        errorDetails = simplifiedError.errorDetails
        errorMessage = simplifiedError.errorMessage as string
    }
    else if (error instanceof AppError) {

        if (error.message === "Unauthorized Access") {
            statusCode = error.statusCode;
            message = error.message;
            errorDetails = [{
                path: '',
                message: ""
            }]
            errorMessage = "You do not have the necessary permissions to access this resource.",
                stack = null
        }
        else {
            statusCode = error.statusCode;
            message = error.message;
            errorDetails = [{
                path: '',
                message: error.message
            }]
        }

    }
    else if (error instanceof Error) {
        message = error.message;
        errorDetails = [{
            path: '',
            message: error.message
        }]
    }

    return res.status(statusCode).json({
        success: false,
        message,
        errorMessage,
        errorDetails,
        name,
        stack,
    })
}
export default globalErrorHandler;