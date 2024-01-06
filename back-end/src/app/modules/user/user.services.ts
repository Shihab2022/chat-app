import config from "../../config";
import AppError from "../../error/appError";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import bcrypt from 'bcrypt'
const createUserIntoDB = async (payload: TUser) => {

    const result = (await User.create(payload)).isSelected("-password")
    return result

}
const LoginUserIntoDB = async (payload: Partial<TUser>) => {
    const { userName, email } = payload


    const user = await User.findOne({ $or: [{ userName }, { email }] })
    if (!user) {
        throw new AppError(404, 'User is not found !')
    }
    const isPassMatch = await bcrypt.compare(payload?.password as string, user.password)
    if (!isPassMatch) {
        throw new AppError(404, "Your password is not match")
    }
    const objData: Partial<TUser> = user.toObject();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...newData } = objData
    return newData

}
const forgetPassword = async (payload: Partial<TUser>) => {
    const { userName, email } = payload


    const user = await User.findOne({ $or: [{ userName }, { email }] })
    if (!user) {
        throw new AppError(404, 'User is not found !')
    }
    const hashPassword = await bcrypt.hash(
        payload.password as string,
        Number(config.bcrypt_salt_rounds)
    )
    await User.findOneAndUpdate({ $or: [{ userName }, { email }] }, { password: hashPassword })

    return null

}

export const UserServices = {
    createUserIntoDB,
    LoginUserIntoDB,
    forgetPassword
}