import mongoose from "mongoose";
import { TMessages } from "./message.interface";



const MessageSchema = new mongoose.Schema<TMessages>({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation"
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: String,
        default: Date
    }

})


export const Message = mongoose.model('Message', MessageSchema);