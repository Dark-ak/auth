import mongo, {Schema, Document, Types} from "mongoose" 


export interface SessionDocument extends Document{
    device: string,
    time: Date,
    status: boolean,
    userId: Types.ObjectId,
    lastlogin: string,
    vendor: string,
    os: {
        name: string,
        version: string
    }
}


const sessionSchema = new Schema({
    device: {type: String, required: true},
    browser: {type: String},
    status: {type: Boolean,default: true},  
    userId: {type: Schema.Types.ObjectId, ref: "users"},
    lastLogin: {type: Date, default: new Date().toUTCString()},
    vendor: {type: String, default: null},
    os: {
        name: {type: String,},
        version: {type: String}
    }

})

const Session = mongo.model<SessionDocument>("Session", sessionSchema)

export default Session