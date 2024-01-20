import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { MessageRoutes } from "../modules/message/message.routes";
import { InviteUserRoutes } from "../modules/conversation/conversation.routes";

const router = Router()

const moduleRoutes = [
    {
        path: '/user',
        endPoint: UserRoutes
    },
    {
        path: '/message',
        endPoint: MessageRoutes
    },
    {
        path: '/invite',
        endPoint: InviteUserRoutes
    },
]


moduleRoutes.forEach(route => router.use(route.path, route.endPoint))
export const rootRouter = router