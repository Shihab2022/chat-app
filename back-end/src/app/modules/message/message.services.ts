import AppError from "../../error/appError";

import bcrypt from 'bcrypt'
import { TMessages } from "./message.interface";
import { Message } from "./message.model";
const createMessageIntoDB = async (payload: TMessages) => {

    const result = (await Message.create(payload)).isSelected("-password")
    return result

}
// const LoginUserIntoDB = async (payload: Partial<TUser>) => {
//     const { userName, email } = payload


//     const user = await User.findOne({ $or: [{ userName }, { email }] })
//     if (!user) {
//         throw new AppError(404, 'User is not found !')
//     }
//     const isPassMatch = await bcrypt.compare(payload?.password as string, user.password)
//     if (!isPassMatch) {
//         throw new AppError(404, "Your password is not match")
//     }
//     const objData: Partial<TUser> = user.toObject();
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const { password, ...newData } = objData
//     return newData

// }
// const forgetPassword = async (payload: Partial<TUser>) => {
//     const { userName, email } = payload


//     const user = await User.findOne({ $or: [{ userName }, { email }] })
//     if (!user) {
//         throw new AppError(404, 'User is not found !')
//     }

//     await User.findOneAndUpdate({ $or: [{ userName }, { email }] }, { password: payload.password })

//     return null

// }

export const MessageServices = {
    createMessageIntoDB
}