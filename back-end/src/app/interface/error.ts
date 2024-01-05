/* eslint-disable @typescript-eslint/no-explicit-any */
export type TErrorSource = {
    path: string | number;
    message: string
}[]

export type TGenericErrorResponse = {
    statusCode: number;
    message: string;
    errorDetails: any,
    stack: any,
    errorMessage: string,
    name: string
}