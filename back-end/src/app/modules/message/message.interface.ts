import { Types } from "mongoose"

export type TMessages = {
    senderId: Types.ObjectId,
    receiverId: Types.ObjectId,
    content: string,
    timestamp: string,
    isDeleted: boolean
}