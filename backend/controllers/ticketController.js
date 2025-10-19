import Ticket from "../models/ticketModel.js";
import Engineer from "../models/engineerModel.js";
import Department from "../models/departmentModel.js";
import { analyzeTicket } from "../services/geminiService.js";

export const createTicket = async(req,res)=>{
    try{
        const {title,description,departmentId} = req.body;
        const ticketText = `${title}\n\n${description}`;
        const analyzedText = await analyzeTicket(ticketText);
        console.log(analyzedText);
        return res.status(200).json(analyzedText);
    }
    catch(error){
        console.log(error);
    }
}


export const getTicketsByEngineer = async(req,res)=>{
    try{

    }
    catch(error){
        console.log(error);
    }
}

export const assignTicket = async(req,res)=>{
    try{

    }
    catch(error){
        console.log(error);
    }
}