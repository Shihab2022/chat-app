import { Router } from "express";
import app from "../../../app";
import { UserController } from "./user.controller";
const router = Router()


router.get('/create', UserController.createUser)

export const UserRoutes = router