import { TErrorSource, TGenericErrorResponse } from "../interface/error";

const handleDuplicateError = (error: any): Partial<TGenericErrorResponse> => {

    const match = error.message.match(/"([^"]*)"/)
    const extractedMessage = match && match[1]
    const errorDetails: TErrorSource = [
        {
            path: '',
            message: `${extractedMessage} is already exits !`
        }
    ]

    const statusCode = 400
    return {
        statusCode,
        message: 'Duplicate Entry',
        errorDetails,
        errorMessage: 'Please change the title .This name is already exit !!!'
    }
}

export default handleDuplicateError