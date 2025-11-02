import Ticket from "../models/ticketModel.js";
import Engineer from "../models/engineerModel.js";

import { analyzeTicket } from "../services/geminiService.js";

import { addTicketVector, findMatchingEngineers, findSimilarTickets } from "../services/vectorService.js";

export const createTicket = async(req,res)=>{
    try{
        const {title,description,departmentId} = req.body;
        const ticketText = `${title}\n\n${description}`;
        const analyzedText = await analyzeTicket(ticketText);
        console.log(analyzedText.summary);
        

        const ticket = await Ticket.create({
            title,
            description,
            category:analyzedText.department,
            priority:analyzedText.priority,
            department: departmentId || undefined,
            createdBy: req.LoggedInUser?._id

        })


        //Ticket Vector will implement later :D hehehe
        await addTicketVector(ticket);

        const similarTickets = await findSimilarTickets(ticketText,3);
        console.log("Similar tickets",similarTickets);


        const matches = await findMatchingEngineers(ticketText,3);
        let assignedEngineer = null;
         console.log(matches);
        if(matches.length > 0){
            const top = matches[0];
            const eng = await Engineer.findById(top.engineerId);
            console.log(eng);
            if(eng){
                assignedEngineer = eng;
                ticket.assignedEngineer = eng._id;
                ticket.status = "In Progress";
                await ticket.save();
                eng.tickets.push(ticket._id);
                await eng.save();
            }
        }

        const populate = await ticket.populate("assignedEngineer","name email");
        res.status(201).json({
            ticket:populate,
            assignedEngineer,
            similarTickets
        })
        
    }
    catch(error){
        console.error(error);
        res.status(500).json({error:"Error creating ticket"});
    }
}


export const getTicketsByEngineer = async(req,res)=>{
    try{
        const engineerId = req.params.id;
        const engineer = await Engineer.findById(engineerId);
        const tickets = await Ticket.find({assignedEngineer:engineer._id});
        res.json(tickets);
    }
    catch(error){
        res.status(500).json({error:"Error fetching tickets"});
    }
}

export const assignTicket = async(req,res)=>{
    try{
        const {ticketId,engineerId} = req.params;
        const ticket = await Ticket.findById(ticketId);
        const engineer = await Engineer.findById(engineerId);

       if(!ticket || !engineer){
        return res.status(404).json({error:"Ticket or Engineer not found"});
       }

       if(ticket.assignedEngineer){
        const oldEngineer = await Engineer.findById(ticket.assignedEngineer);
        if(oldEngineer){
            
            oldEngineer.tickets = oldEngineer.tickets.filter((ticketId) => ticketId.toString() !== ticket._id.toString());
            await oldEngineer.save();
        }
       }

       ticket.assignedEngineer = engineer._id;
       await ticket.save();
       engineer.tickets.push(ticket._id);
       await engineer.save();

       const populate = await ticket.populate("assignedEngineer","name email");
       res.json(populate);
    }
    catch(error){
        console.error(error);
        res.status(500).json({error:"Error assigning ticket"});
    }
}


export const addResolution = async(req,res)=>{
    try{
        const {ticketId} = req.params;
        const {resolution} = req.body;
        const ticket = await Ticket.findById(ticketId);
        if(!ticket){
            return res.status(404).json({error:"Ticket not found"});
        }
        ticket.resolution = resolution;
        ticket.status = "resolved";
        ticket.comment.push({
            author:"Engineer",
            message:`${resolution}`
        })
        await ticket.save();
        res.json(ticket);
    }
    catch(error){
        console.error(error);
        res.status(500).json({error:"Error adding resolution"});
    }
}

export const closeTicket = async(req,res)=>{
    try{
        const {ticketId} = req.params;
        const adminId = req.LoggedInUser._id;

        const ticket = await Ticket.findById(ticketId);
        if(!ticket){
            return res.status(404).json({error:"Ticket not found"});
        }

        if(ticket.status!=="Resolved"){
            return res.status(400).json({error:"Ticket is not resolved"});
        }

        ticket.status = "Closed";
        ticket.comment.push({
            author:"Admin",
            message:`Closing the Ticket,Issue Resolved`
        })
        ticket.closedBy = adminId;
        ticket.closedAt = Date.now();
        await ticket.save();
        res.status(200).json({
            message:"Ticket closed successfully",
            ticket
        });
    }
    catch(error){
        console.error(error);
        res.status(500).json({error:"Error closing ticket"});
    }
}

export const getTicketsByUser = async (req, res) => {
    try {
        const userId = req.LoggedInUser?._id;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });
        const tickets = await Ticket.find({ createdBy: userId })
          .populate("assignedEngineer", "name email")
          .populate("department", "name")
          .sort({ createdAt: -1 });
        res.json(tickets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching your tickets" });
    }
}