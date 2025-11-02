import express from "express";
import {
  createTicket,
  getTicketsByEngineer,
  assignTicket,
  addResolution,
  getTicketsByUser,
} from "../controllers/ticketController.js";
import { verifyToken,authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create",verifyToken,authorizeRoles("user"), createTicket);
router.get("/user/my", verifyToken, authorizeRoles("user"), getTicketsByUser);
router.get("/enginner/:id",verifyToken,authorizeRoles("engineer"), getTicketsByEngineer);
router.put("/assign/:ticketId/:engineerId",verifyToken,authorizeRoles("admin"), assignTicket);
router.put("/resolve/:ticketId",verifyToken,authorizeRoles("engineer"), addResolution);
router.put("/close/:ticketId",verifyToken,authorizeRoles("admin"), addResolution);  
export default router;
