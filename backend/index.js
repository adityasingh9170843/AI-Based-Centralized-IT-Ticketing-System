import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { dbConnect } from './utils/dbConnect.js';
import ticketRoutes from './routes/ticketRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import engineerRoutes from './routes/engineerRoutes.js';
import './services/emailListener.js';


const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

dotenv.config({quiet: true});


app.use("/api/tickets",ticketRoutes);
app.use("/api/departments",departmentRoutes);
app.use("/api/engineers",engineerRoutes);

app.listen(process.env.PORT, () => {
    dbConnect();
    console.log("Server is running on port " + process.env.PORT);
});