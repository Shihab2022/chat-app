import { Router } from 'express';
import { UserController } from './user.controller';
import { protectRoute } from '../../middlewares/protectRoute';
const router = Router();

router.post('/create', UserController.createUser);
router.post('/login', UserController.loginUser);
router.post('/forget-password', UserController.forgetPassword);
router.get('/check', UserController.checkAuth);

export const UserRoutes = router;
