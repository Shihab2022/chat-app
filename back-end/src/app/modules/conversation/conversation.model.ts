import mongoose from "mongoose";
import { TConversation, TParticipant } from "./conversation.interface";

const ParticipantSchema = new mongoose.Schema<TParticipant>({
    participant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    lastMessage: {
        type: String,
    }
})


const ConversationSchema = new mongoose.Schema<TConversation>({
    participants: {
        type: [ParticipantSchema],
        required: [true, "This is required"]
    }

})


export const Conversation = mongoose.model('Conversation', ConversationSchema);