import { Router } from "express";
import { InviteUserController } from "./conversation.controller";
const router = Router()


router.post('/send', InviteUserController.InviteUser)
router.get('/getConversation/:id', InviteUserController.getConversation)


export const InviteUserRoutes = router