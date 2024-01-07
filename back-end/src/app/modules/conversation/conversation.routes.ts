import { Router } from "express";
import { InviteUserController } from "./conversation.controller";
const router = Router()


router.post('/send', InviteUserController.InviteUser)
// router.post('/getMessage', MessageController.getMessage)


export const InviteUserRoutes = router