import expres, {Request, Response} from "express"
import { OtpController } from "../controllers/otp"


export const otpRouter = expres.Router()

otpRouter.post("/send", OtpController.send)
otpRouter.get("/verify", )