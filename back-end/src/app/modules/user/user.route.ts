import { Router } from "express";
import app from "../../../app";
import { UserController } from "./user.controller";
const router = Router()


router.post('/create', UserController.createUser)
router.post('/login', UserController.loginUser)
router.post('/forget-password', UserController.forgetPassword)

export const UserRoutes = router