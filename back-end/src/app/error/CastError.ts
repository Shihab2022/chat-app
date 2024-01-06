import mongoose from "mongoose";
import { TGenericErrorResponse } from "../interface/error";

const handleCastError = (error: mongoose.Error.CastError): Partial<TGenericErrorResponse> => {
    const statusCode = 400
    return {
        statusCode,
        message: 'Invalid ID',
        errorMessage: `${error.value} is not a valid ID!`,
        errorDetails: error,

    }
}

export default handleCastError