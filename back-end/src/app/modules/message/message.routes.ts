import { Router } from 'express';
import { MessageController } from './message.controller';
import auth from '../../middlewares/protectRoute';
import { userRole } from '../../../constant';
const router = Router();
router.get(
  '/users',
  auth(userRole?.USER),
  MessageController.getUsersForSidebar,
);
router.post('/send', auth(userRole?.USER), MessageController.sendMessage);
router.get('/get', auth(userRole?.USER), MessageController.getMessage);
router.post('/emoji', auth(userRole?.USER), MessageController.addEmoji);
router.delete('/emoji', auth(userRole?.USER), MessageController.removeEmoji);
router.patch('/', auth(userRole?.USER), MessageController.editMessage);

export const MessageRoutes = router;
