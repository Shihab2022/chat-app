import mongoose from "mongoose";
import { TGenericErrorResponse } from "../interface/error";


const handleValidationError = (error: mongoose.Error.ValidationError): Partial<TGenericErrorResponse> => {
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars

    const errorDetails: any = Object.values(error.errors).map((value: mongoose.Error.ValidationError | mongoose.Error.CastError | mongoose.Error) => {
        if (value instanceof mongoose.Error.CastError) {
            return {
                errorDetails: value,
                stack: value.stack,
                message: "Invalid ID",
                errorMessage: `${value?.value} is not a valid ID!`

            }
        }

    })
    const statusCode = 400
    return {
        statusCode,
        message: errorDetails[0].message ? errorDetails[0].message : 'CastError Error',
        errorMessage: errorDetails[0].errorMessage,
        errorDetails: errorDetails[0].errorDetails,
        stack: errorDetails[0].stack,
    }

}

export default handleValidationError