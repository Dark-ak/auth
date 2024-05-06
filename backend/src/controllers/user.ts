import { Request, Response,NextFunction } from "express";
import User from "../models/user";
import * as bcrypt from "bcrypt"
import ua from "ua-parser-js";
import Cookies from "js-cookie";
import Session from "../models/sessions";
import * as jwt from "jsonwebtoken"
// import Session from "../models/sessions";
// import { validate, IsEmail, length, } from "class-validator";

// class User {

//     @length(10, 50)
//     name: string;

//     @IsEmail()
//     email: string;

//     @length(6)
//     password: string
// }


export class UserController {

    static async authenticate(req:Request, res:Response, next: NextFunction){
        const token = req.headers.authorization?.split(" ")[1]

        if(!token){
            return res.status(401).send("Unauthorized")
        }
    
        const check = jwt.verify(token!, "darkak")
    
        if(!check){
            return res.status(401).send("Invalid token")
        }
    
        next()
    }

    // register
    static async register(req: Request, res: Response) {
        const { name, email, password } = req.body


        const user = await User.findOne({ email: email })
        if (user) {
            return res.status(404).json({ error: "Email already exists" })
        }

        const hash = await bcrypt.hash(password, 10)

        try {
            const create = await User.create({
                name: name,
                email: email,
                password: hash,
                role: "user"
            })

            create.save()

            res.status(201).json({ message: "Account Created" })
        } catch (err) {
            console.error(err)
            res.status(400).json({ error: "Error making account" })
        }
    }

    // login
    static async login(req: Request, res: Response) {
        const { email, password } = req.body

        const agent = ua.UAParser(req.headers['user-agent'])

        try {
            const user = await User.findOne({ email: email })

            if (!user) {
                return res.status(400).json({ errors: "Invalid email or password" })
            }

            const hash = await bcrypt.compare(password, user.password)

            if (!hash) {
                return res.status(400).json({ errors: "Invalid email or password" })
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
            const data = {
                session: session._id,
                token: token
            }
            session.save()

            return res.status(200).json(data)

        } catch (error) {
            console.error(error)
            return res.status(500).json({ errors: "Internal server Error" })

        }
    }

    static async getSession(req:Request, res: Response){
        try{
            const {authsession} = req.headers
            const session = await Session.findById(authsession)
            if(!session){
                return res.status(400).send("Not Authorized")
            }

            const allSessions = await Session.find({userId: session.userId})

            return res.status(200).json({allSessions})

        }catch(err){
            console.log(err)
            res.status(500).json({message: "Internal Server error"})
        }
    }

    static async logout(req: Request, res:Response ){
        const {authsession} = req.headers

        try{
            const session = await Session.findByIdAndDelete(authsession)
            return res.status(200).json({message: "logged Out"})
        }catch(err){
            console.log(err)
            return res.status(500).json({message: "internal Server Error"})
        }
    }
}
