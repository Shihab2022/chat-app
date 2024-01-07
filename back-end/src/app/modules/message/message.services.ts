import AppError from "../../error/appError";

import bcrypt from 'bcrypt'
import { TMessages } from "./message.interface";
import { Message } from "./message.model";
const createMessageIntoDB = async (payload: TMessages) => {

    const result = await Message.create(payload)
    return result

}
const getMessageFromDB = async (payload: Partial<TMessages>) => {
    const { senderId, receiverId } = payload
    const searchCriteria = {
        $or: [
            {
                $and: [
                    { senderId },
                    { receiverId }
                ]
            },
            {
                $and: [
                    { receiverId: senderId },
                    { senderId: receiverId }
                ]
            }
        ]
    };

    const messages = await Message.find(searchCriteria)
    return messages


}


export const MessageServices = {
    createMessageIntoDB,
    getMessageFromDB
}