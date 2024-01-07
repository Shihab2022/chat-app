import { Types } from "mongoose"

export type TParticipant = {
    participant: Types.ObjectId
    lastMessage: string,
    timestamp: string,
}

export type TConversation = {
    admin: Types.ObjectId,
    participants: [TParticipant]
}