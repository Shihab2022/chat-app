import { Router } from 'express';
import { MessageController } from './message.controller';
import auth from '../../middlewares/protectRoute';
import { userRole } from '../../../constant';

const router = Router();

router.get('/users', auth(userRole?.USER), MessageController.getUsersForSidebar);
router.post('/send', auth(userRole?.USER), MessageController.sendMessage);
router.get('/get', auth(userRole?.USER), MessageController.getMessage);
router.post('/emoji', auth(userRole?.USER), MessageController.addEmoji);
router.delete('/emoji', auth(userRole?.USER), MessageController.removeEmoji);
router.patch('/', auth(userRole?.USER), MessageController.editMessage);
router.delete('/', auth(userRole?.USER), MessageController.deleteMessage);
router.post('/forward', auth(userRole?.USER), MessageController.ForwardMessage);
router.post('/reply', auth(userRole?.USER), MessageController.replyMessage);
router.post('/clear', auth(userRole?.USER), MessageController.clearMessage);
router.delete('/delete', auth(userRole?.USER), MessageController.deleteAllMessages);

router.get('/groups', auth(userRole?.USER), MessageController.listGroups);
router.post('/groups', auth(userRole?.USER), MessageController.createGroup);
router.post('/groups/:groupId/members', auth(userRole?.USER), MessageController.addGroupMember);
router.post('/group/send', auth(userRole?.USER), MessageController.sendGroupMessage);
router.get('/group/get', auth(userRole?.USER), MessageController.getGroupMessages);

router.post('/group', auth(userRole?.USER), MessageController.createGroup);
router.post('/group/member', auth(userRole?.USER), MessageController.addGroupMember);
router.post('/groups/:groupId/messages', auth(userRole?.USER), MessageController.sendGroupMessage);
router.get('/groups/:groupId/messages', auth(userRole?.USER), MessageController.getGroupMessages);
router.post('/group/:groupId/messages', auth(userRole?.USER), MessageController.sendGroupMessage);
router.get('/group/:groupId/messages', auth(userRole?.USER), MessageController.getGroupMessages);

export const MessageRoutes = router;
