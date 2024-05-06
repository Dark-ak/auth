import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()


export default function dbConnection() {
    try{
        mongoose.connect(process.env.db_url!)
        console.log("Connected to db")
    }catch(err){
        console.error(err)
    }
}