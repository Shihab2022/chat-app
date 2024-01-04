import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";

const router = Router()

const moduleRoutes = [
    {
        path: '/user',
        endPoint: UserRoutes
    },
]


moduleRoutes.forEach(route => router.use(route.path, route.endPoint))
export const rootRouter = router