import express, {Express, Request, Response} from "express"
import { userRouter } from "./src/routes/user"
import { otpRouter } from "./src/routes/otp"
import { adminRouter } from "./src/routes/admin"
import cors from "cors"
import dbConnection from "./src/utils/db"
const app: Express = express()
const port = 3000


app.use(cors())
app.use(express.json())
dbConnection()

app.use("/user", userRouter)
app.use("/otp", otpRouter)
app.use("/admin", adminRouter)


app.get('/', (req: Request, res: Response) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))