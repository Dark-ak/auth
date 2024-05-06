import express from "express"
import { UserController } from "../controllers/user"


export const userRouter = express.Router()

userRouter.get("/sessions",UserController.authenticate, UserController.getSession)

userRouter.post("/login", UserController.login)

userRouter.get("/logout", UserController.logout)

userRouter.post("/register", UserController.register)