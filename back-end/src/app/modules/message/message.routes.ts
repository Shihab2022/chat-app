import { Router } from 'express';
import { MessageController } from './message.controller';
import auth from '../../middlewares/protectRoute';
import { userRole } from '../../../constant';
import { fileUploader } from '../../../utils/fileUploder';

const router = Router();

router.get('/users', auth(userRole?.USER), MessageController.getUsersForSidebar);
router.post('/upload', auth(userRole?.USER), fileUploader.upload.single('file'), MessageController.uploadAttachment);
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

router.get('/stats', auth(userRole?.USER), MessageController.conversationStats);
router.get('/shared', auth(userRole?.USER), MessageController.sharedConversationContent);

router.get('/groups', auth(userRole?.USER), MessageController.listGroups);
router.post('/groups', auth(userRole?.USER), MessageController.createGroup);
router.post('/groups/:groupId/members', auth(userRole?.USER), MessageController.addGroupMember);
router.get('/groups/invitations/pending', auth(userRole?.USER), MessageController.listPendingGroupInvitations);
router.post('/groups/invitations/:invitationId/accept', auth(userRole?.USER), MessageController.acceptGroupInvitation);
router.get('/groups/:groupId', auth(userRole?.USER), MessageController.groupDetails);
router.get('/groups/:groupId/members', auth(userRole?.USER), MessageController.groupMembers);
router.delete('/groups/:groupId/members/:memberId', auth(userRole?.USER), MessageController.removeGroupMember);
router.patch('/groups/:groupId/members/:memberId/role', auth(userRole?.USER), MessageController.setGroupMemberRole);
router.patch('/groups/:groupId', auth(userRole?.USER), MessageController.updateGroup);
router.post('/groups/:groupId/leave', auth(userRole?.USER), MessageController.leaveGroup);
router.delete('/groups/:groupId', auth(userRole?.USER), MessageController.deleteGroup);
router.post('/group/send', auth(userRole?.USER), MessageController.sendGroupMessage);
router.get('/group/get', auth(userRole?.USER), MessageController.getGroupMessages);

router.post('/group', auth(userRole?.USER), MessageController.createGroup);
router.post('/group/member', auth(userRole?.USER), MessageController.addGroupMember);
router.post('/groups/:groupId/messages', auth(userRole?.USER), MessageController.sendGroupMessage);
router.get('/groups/:groupId/messages', auth(userRole?.USER), MessageController.getGroupMessages);
router.post('/group/:groupId/messages', auth(userRole?.USER), MessageController.sendGroupMessage);
router.get('/group/:groupId/messages', auth(userRole?.USER), MessageController.getGroupMessages);

export const MessageRoutes = router;
