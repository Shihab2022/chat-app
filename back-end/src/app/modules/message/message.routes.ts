import { Router } from "express";
import { MessageController } from "./message.controller";
const router = Router()


router.post('/send', MessageController.createMessage)


export const MessageRoutes = router