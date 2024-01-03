import mongoose from "mongoose";
import { TUser } from "./user.interface";



const UserSchema = new mongoose.Schema<TUser>({
    username: {
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
    }

})