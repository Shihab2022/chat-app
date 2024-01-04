import express, { json } from "express"
import cors from "cors"
import { rootRouter } from "./app/routes"
const app = express()


app.use(json())
app.use(cors())
app.use('/api', rootRouter)
app.get('/', (req, res) => {
    res.send('Hello World!')
})



export default app
