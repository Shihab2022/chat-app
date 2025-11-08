import { Router } from 'express';
import { UserController } from './user.controller';
import auth from '../../middlewares/protectRoute';
import { userRole } from '../../../constant';
const router = Router();

router.post('/create', UserController.createUser);
router.post('/confirm', UserController.confirmUser);
router.post('/send', UserController.sendEmail);
router.post('/accept-invite', UserController.acceptInvite);
router.post('/login', UserController.loginUser);
router.post('/google-login', UserController.googleLogin);
router.post('/forget-password', UserController.forgetPassword);
router.post('/update-password', UserController.updatePassword);
router.post('/check', UserController.checkAuth);
router.post('/invite', auth(userRole?.USER), UserController.inviteUser);
router.post(
  '/update-info',
  auth(userRole?.USER),
  UserController.updateUserInfo,
);

export const UserRoutes = router;
