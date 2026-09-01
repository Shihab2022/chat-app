import { Router } from 'express';
import { CallController } from './call.controller';
import auth from '../../middlewares/protectRoute';
import { userRole } from '../../../constant';

const router = Router();

router.get('/history', auth(userRole?.USER), CallController.getCallHistory);
router.post('/logs', auth(userRole?.USER), CallController.createCallLog);
router.patch('/logs/:callId', auth(userRole?.USER), CallController.updateCallLog);

export const CallRoutes = router;