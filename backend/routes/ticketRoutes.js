import express from "express";
import {
  createTicket,
  getTicketsByEngineer,
  assignTicket,
  addResolution,
  closeTicket,
  getTicketsByUser,
  getallTickets
} from "../controllers/ticketController.js";
import { verifyToken,authorizeRoles, protectEngineer } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create",verifyToken,authorizeRoles("user"), createTicket);
router.get("/",verifyToken,authorizeRoles("admin"), getallTickets);
router.get("/user/my", verifyToken, authorizeRoles("user"), getTicketsByUser);
router.get("/engineer/:id", protectEngineer, getTicketsByEngineer);
router.put("/assign/:ticketId/:engineerId",verifyToken,authorizeRoles("admin"), assignTicket);
router.put("/resolve/:ticketId", protectEngineer, addResolution);
router.put("/close/:ticketId",verifyToken,authorizeRoles("admin"), closeTicket);
export default router;
