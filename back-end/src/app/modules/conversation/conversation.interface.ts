import { Schema } from "mongoose"

export type TParticipant = {
    participant: Schema.Types.ObjectId,
    lastMessage: string,
}

export type TConversation = {
    participants: [TParticipant]
}