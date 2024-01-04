import { Request, Response } from "express";

const createUser = async (req: Request, res: Response) => {
    console.log('request is comming ')
    res.send({
        success: true,
    })
}

export const UserController = {
    createUser
}