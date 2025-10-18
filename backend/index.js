import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { dbConnect } from './utils/dbConnect.js';

const app = express();
app.use(express.json());
app.use(cookieParser());

dotenv.config({quiet: true});


app.listen(process.env.PORT, () => {
    dbConnect();
    console.log("Server is running on port " + process.env.PORT);
});