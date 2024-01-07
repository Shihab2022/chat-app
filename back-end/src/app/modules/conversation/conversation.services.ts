import AppError from "../../error/appError";
import { TConversation } from "./conversation.interface";
import { Conversation } from "./conversation.model";
import { httpStatus } from 'http-Status';

const inviteUserIntoDB = async (payload: any) => {
    const { admin, participants } = payload
    const isAdminPresent = await Conversation.findOne({ admin })
    if (isAdminPresent) {
        console.log('this is present')
        const remain = isAdminPresent.participants.filter(data => data.participant.equals(participants.participant))
        console.log('remain', remain)
        if (remain.length === 0) {
            const nn = await Conversation.findOneAndUpdate(
                {
                    admin: admin,
                    "participants.participant": { $ne: participants.participant }
                },
                {
                    $addToSet: {
                        participants: participants
                    }
                },
                { new: true, upsert: true },)
        }
        else {
            throw new AppError(404, "This user is already present !")
        }

    }
    else {
        console.log('this is not  present')
        const result = await Conversation.create({ admin: admin, participants: [participants] })
    }



    return isAdminPresent

}
// const getMessageFromDB = async (payload: Partial<TMessages>) => {
//     const { senderId, receiverId } = payload
//     const searchCriteria = {
//         $or: [
//             {
//                 $and: [
//                     { senderId },
//                     { receiverId }
//                 ]
//             },
//             {
//                 $and: [
//                     { receiverId: senderId },
//                     { senderId: receiverId }
//                 ]
//             }
//         ]
//     };

//     const messages = await Message.find(searchCriteria)
//     return messages


// }


export const InviterUserServices = {
    inviteUserIntoDB,
    // getMessageFromDB
}


