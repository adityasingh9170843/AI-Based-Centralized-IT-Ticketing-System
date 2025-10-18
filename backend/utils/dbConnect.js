import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({quiet: true});

export const dbConnect = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database connected");
    }catch(error){
        console.log(error);
        process.exit(1);
    }
}