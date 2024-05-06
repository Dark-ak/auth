import { Request, Response } from "express";
import Otp from "../models/opt";
import * as randomstring from "randomstring";
import { sendOtp } from "../utils/mail";

export class OtpController{

    static async send(req: Request,  res: Response){
        const {email} = req.body

        const otp = randomstring.generate({length:4, charset: "numeric"})
        const data = {
            email: email,
            otp: otp
        }

        try{

            const del = await Otp.deleteMany({email: email})

            const otpQuery = await Otp.create(data)

            otpQuery.save()

            const body = `Your One time password is ${otp}. it will expire in 10 minutes`
            
            sendOtp(body, email)


            res.status(200)
        }
        catch(err){
            console.error("Internal Server Error")
            res.status(500).json({message: "Internal server error"})
        }
    }

    static async verify(req: Request, res: Response){
        const {otp} = req.query

        try{
            const check = Otp.findOneAndDelete({otp: otp})

            if(!check){
                return res.status(404).json({message:"Invalid Otp"})
            }


        }catch(err){
            console.log(err)
            res.status(400).json({error: "Internal Server Error"})
        }


    }
}


