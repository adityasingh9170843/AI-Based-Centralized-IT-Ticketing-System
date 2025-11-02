import express from "express";
import { addEngineer,getEngineerTickets,getEngineers } from "../controllers/engineerController.js";
import { verifyToken,authorizeRoles, protectEngineer } from "../middleware/authMiddleware.js";
const router = express.Router();



router.post("/",verifyToken,authorizeRoles("admin"),addEngineer)
router.get("/",verifyToken,authorizeRoles("admin"),getEngineers)
router.get("/:id/tickets",protectEngineer,getEngineerTickets)

export default router