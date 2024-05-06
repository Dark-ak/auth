import express from "express"
import { AdminController } from "../controllers/admin"

export const adminRouter = express.Router()

adminRouter.get("/mySession",AdminController.auth, AdminController.mySession)

adminRouter.get("/sessions",AdminController.auth, AdminController.allSessions)

adminRouter.post("/login", AdminController.login)

adminRouter.post("/add", AdminController.auth, AdminController.addAdmin)

adminRouter.post("/remove", AdminController.auth, AdminController.removeSessions)