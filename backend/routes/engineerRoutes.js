import express from "express";
import { addEngineer,getEngineerTickets,getEngineers } from "../controllers/engineerController.js";

const router = express.Router();



router.post("/",addEngineer)
router.get("/",getEngineers)
router.get("/:id/tickets",getEngineerTickets)

export default router