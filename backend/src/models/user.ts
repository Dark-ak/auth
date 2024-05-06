
import mongo, {Schema, Document} from "mongoose"

export interface UserDocument extends Document{
    name: string,
    email: string,
    password: string,
    role: string
}

const userSchema = new Schema({
    name: {type:String, required: true},
    email: {type:String, required: true, unique: true},
    password: {type:String, required: true},
    role: {type: String, default:"user"}
})

const User = mongo.model<UserDocument>("User", userSchema)

export default User