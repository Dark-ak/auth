import User from "../models/user";
import Session from "../models/sessions";
import { Response, Request,NextFunction } from "express";
import jwt from "jsonwebtoken"
import ua from "ua-parser-js";

import bcrypt from "bcrypt"

export class AdminController{

    static async auth(req:Request, res:Response, next: NextFunction){
        const token = req.headers.authorization?.split(" ")[1]

        if(!token){
            return res.status(401).send("Unauthorized")
        }
    
        const check = jwt.verify(token!, "darkak")

        
        if(!check){
            return res.status(401).send("Invalid token")
        }
        const session = await Session.findById(req.headers.authsession)

        if(!session){
            return res.status(401).send("Unauthorized")
        }

        const user = await User.findById(session?.userId)

        if(user?.role != "admin"){
            return res.status(401).send("Unauthorized")
        }
        next()
    }

    static async mySession(req: Request,res:Response){
        const userId = req.headers.userid
        try {
            const userSession = await Session.find({userId: userId})

            res.status(200).json({userSession})
            
        } catch (error) {
            console.log(error)
            res.status(500).json({message: "Internal server error"})
        }
    }


    static async allSessions(req:Request, res:Response){
        try {
            const session = await Session.find()
            res.status(200).json({session})
            
        } catch (error) {
            
        }
    }

    static async addAdmin(req:Request,res:Response){
        try{
            const userId = req.body.userId

            const user = await User.findById(userId)

            if(!user){
                return res.status(404).send("User Doesn't exist")
            } 

            user.role = "admin"
            user.save()

            res.status(200).json({message: "Completed"})

        }catch(err){
            console.log(err)
            res.status(500).json({error: "Internal Server Error"})
        }
    }

    static async login(req:Request, res: Response) {
        
        const {email, password} = req.body
        const agent = ua.UAParser(req.headers['user-agent'])
        
        try{
            const user = await User.findOne({email: email})

            if(!user){
                return res.status(400).json({message: "Invalid email and password"})
            }

            if(user.role != "admin"){
                return res.status(400).json({message: "Invalid email and password"})

            }
            const pass = await bcrypt.compare(password, user.password)

            if(!pass){
                return res.status(400).json({message: "Invalid email and password"})
            }

            const token = jwt.sign({ userId: user._id }, "darkak")
            const sessionData = {
                browser: agent.browser.name,
                userId: user._id,
                os: agent.os,
                device: agent.device.model ? agent.device.model : "Desktop",
                vendor: agent.device.model ? agent.device.vendor : ""
            }
            
            
            const session = await Session.create(sessionData)
            res.cookie('sessionId', session._id, {httpOnly:true, secure: true})
            res.cookie('token', token, {httpOnly:true, secure: true})
            session.save()

            return res.status(200).json({ message: "Logged in" })
        }catch(err){
            console.log(err)
            res.status(500).json({message: "Internal server Error"})
        }

    }

    static async removeSessions(req:Request,res: Response){
        try{
            const sessionId = req.headers.sessionId
            const session = await Session.findByIdAndDelete(sessionId)
            res.status(200)
        }catch(err){
            console.log(err)
            res.status(500).json({message: "Internal Server Error"})
        }
    }
}