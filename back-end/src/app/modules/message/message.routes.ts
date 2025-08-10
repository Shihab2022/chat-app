import { Router } from 'express';
import { MessageController } from './message.controller';
const router = Router();
router.get('/users', MessageController.getUsersForSidebar);
router.post('/send', MessageController.createMessage);
router.get('/get', MessageController.getMessage);

export const MessageRoutes = router;
