import { Router } from "express";
import { MessageController } from "./message.controller";
const router = Router()


router.post('/send', MessageController.createMessage)
router.post('/getMessage', MessageController.getMessage)


export const MessageRoutes = router