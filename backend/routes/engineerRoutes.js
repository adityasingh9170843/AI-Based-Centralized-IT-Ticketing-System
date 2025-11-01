import express from "express";
import { addEngineer,getEngineerTickets,getEngineers } from "../controllers/engineerController.js";
import { verifyToken,authorizeRoles } from "../middleware/authMiddleware.js";
const router = express.Router();



router.post("/",verifyToken,authorizeRoles("admin"),addEngineer)
router.get("/",verifyToken,authorizeRoles("admin"),getEngineers)
router.get("/:id/tickets",verifyToken,authorizeRoles("engineer"),getEngineerTickets)

export default router