import AppError from "../../error/appError";
import { TUser } from "./user.interface";
import { User } from "./user.model";

const createStudentIntoDB = async (studentData: TUser) => {

    const result = await User.create(studentData)
    return result

}

export const UserServices = {
    createStudentIntoDB
}