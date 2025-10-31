import Ticket from "../models/ticketModel";
import {
  addTicketVector,
  findMatchingEngineers,
  
} from "../services/vectorService";
import { analyzeTicket } from "../services/geminiService";
export const handleChat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    const parsed = await ChatbotService.parseChatMessageToTicket(message);

    if (parsed.intent !== "create_ticket") {
      return res.status(200).json({
        reply: "Got it! But it doesn't look like a support request.",
        intent: parsed.intent,
      });
    }

    const analyzedText = await analyzeTicket(parsed.description);
    console.log(analyzedText.summary);

    const ticket = await Ticket.create({
      title: parsed.title,
      description: parsed.description,
      category: analyzeTicket.department,
      priority: analyzeTicket.priority,
    });

    await addTicketVector(ticket);

    const matches = await findMatchingEngineers(parsed.description, 3);
    let assignedEngineer = null;

    if (matches.length > 0) {
      const top = matches[0];
      const eng = await Engineer.findById(top.engineerId);
      if (eng) {
        assignedEngineer = eng;
        ticket.assignedEngineer = assignedEngineer._id;
        await ticket.save();
        eng.tickets.push(ticket._id);
        await eng.save();
      }
    }

    const populated = await ticket.populate("assignedEngineer", "name email");

    res.status(200).json({
      reply: "Got it! I've created a ticket for you.",
      ticket: populated,
      assignedEngineer,
    });
  } catch (error) {
    console.error("Error in chatbot ticket creation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
