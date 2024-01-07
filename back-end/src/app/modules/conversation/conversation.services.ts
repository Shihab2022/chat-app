import AppError from "../../error/appError";
import { TConversation } from "./conversation.interface";
import { Conversation } from "./conversation.model";

const inviteUserIntoDB = async (payload: any) => {
    const { admin, participants } = payload
    const isAdminPresent = await Conversation.findOne({ admin })
    let returnData
    if (isAdminPresent) {
        const remain = isAdminPresent.participants.filter(data => data.participant === participants.participant)
        if (remain.length === 0) {
            returnData = await Conversation.findOneAndUpdate(
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
        returnData = await Conversation.create({ admin: admin, participants: [participants] })
    }



    return returnData

}
const getConversation = async (payload: string) => {

    const result = await Conversation.findOne({ admin: payload })
    if (!result) {
        throw new AppError(404, "You have no conversation ")
    }
    return result


}


export const InviterUserServices = {
    inviteUserIntoDB,
    getConversation
}


