import { Router } from 'express';
import { UserController } from './user.controller';
import auth from '../../middlewares/protectRoute';
import { userRole } from '../../../constant';
const router = Router();

router.post('/create', UserController.createUser);
router.post('/login', UserController.loginUser);
router.post('/forget-password', UserController.forgetPassword);
router.get('/check', auth(userRole?.USER), UserController.checkAuth);

export const UserRoutes = router;
