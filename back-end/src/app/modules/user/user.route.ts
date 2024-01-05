import { Router } from "express";
import app from "../../../app";
import { UserController } from "./user.controller";
const router = Router()


router.post('/create', UserController.createUser)

export const UserRoutes = router