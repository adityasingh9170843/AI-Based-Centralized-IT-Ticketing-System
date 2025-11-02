import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { dbConnect } from "./utils/dbConnect.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import analyticRoutes from "./routes/analyticRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import authRoutes from "./routes/authRoute.js";
import engineerRoutes from "./routes/engineerRoutes.js";
import engineerAuthRoutes from "./routes/engineerAuthRoutes.js";
import "./services/emailListener.js";

const app = express();

app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

dotenv.config({ quiet: true });

app.use("/api/tickets", ticketRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/engineers", engineerRoutes);
app.use("/api/engineer", engineerAuthRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/analytic", analyticRoutes);
app.use("/api/auth", authRoutes);



app.listen(process.env.PORT, () => {
  dbConnect();
  console.log("Server is running on port " + process.env.PORT);
});
