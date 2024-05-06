import mongo, {Schema, Document, Types} from "mongoose" 


export interface OTPDocument extends Document{
    otp: string,
    email: string,
    expiry: Date
}


const otpSchema = new Schema({
    otp: {type: String, required: true},
    email: {type: String, required: true},
    expiry: {type: Date, default: Date.now(), expires: 60 *5}
})

const Otp = mongo.model("Otp", otpSchema)


export default Otp