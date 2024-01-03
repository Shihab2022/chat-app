import { Types } from "mongoose"

export type TParticipant = {
    participant: Types.ObjectId
    lastMessage: string,
}

export type TConversation = {
    participants: [TParticipant]
}