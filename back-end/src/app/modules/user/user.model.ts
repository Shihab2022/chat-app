import mongoose from "mongoose";
import { TUser } from "./user.interface";
import config from "../../config";
import bcrypt from "bcrypt"


const UserSchema = new mongoose.Schema<TUser>({
    userName: {
        type: String,
        required: [true, "User name is required and unique"],
        unique: true
    },
    name: {
        type: String,

    }
    ,
    img: {
        type: String,
    },
    email: {
        type: String,
        required: [true, "Email is required and unique"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    status: {
        type: String
    }

})
UserSchema.pre('save', async function (next) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user = this
    user.password = await bcrypt.hash(
        user.password,
        Number(config.bcrypt_salt_rounds)
    )
    next()

})

export const User = mongoose.model('User', UserSchema);