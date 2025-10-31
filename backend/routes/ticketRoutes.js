import express from "express";
import {
  createTicket,
  getTicketsByEngineer,
  assignTicket,
  addResolution,
} from "../controllers/ticketController.js";

const router = express.Router();

router.post("/create", createTicket);
router.get("/enginner/:id", getTicketsByEngineer);
router.put("/assign/:ticketId/:engineerId", assignTicket);
router.put("/resolve/:ticketId", addResolution);

export default router;
