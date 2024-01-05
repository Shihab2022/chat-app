import express, { json } from "express"
import cors from "cors"
import { rootRouter } from "./app/routes"
import globalErrorHandler from "./app/middlewares/globalErrorHandllers"
const app = express()


app.use(json())
app.use(cors())
app.use('/api', rootRouter)



app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.use(globalErrorHandler)



export default app
