import express from "express";
import Ticket from "../models/ticketModel.js";
import {
  createTicket,
  getTicketsByEngineer,
  assignTicket,
} from "../controllers/ticketController.js";

const router = express.Router();

router.post("/", createTicket);
router.get("/enginner/:id", getTicketsByEngineer);
router.put("/assign/:ticketId/:engineerId", assignTicket);

export default router;
