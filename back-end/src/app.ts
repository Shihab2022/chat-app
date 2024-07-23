import express, { json } from "express"
import cors from "cors"
// import cookieParser from 'cookie-parser'
import { rootRouter } from "./app/routes"
import globalErrorHandler from "./app/middlewares/globalErrorHandllers"
import { notFound, testingRoute } from "./constant/route"
import { corsAllowOrigin } from "./constant"
const app = express()


app.use(json())
app.use(cors(corsAllowOrigin))
// app.use(cookieParser())
app.get('/', testingRoute)
app.use('/api', rootRouter)
app.use(globalErrorHandler)
app.use(notFound)


export default app
