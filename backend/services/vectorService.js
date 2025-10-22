import { PineconeStore } from "@langchain/pinecone";
import { embeddings } from "./embeddingService.js";
import { pineconeIndex } from "./pineconeClient.js";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

export const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
  pineconeIndex,
  maxConcurrency: 5,
});

export const addTicketVector = async (ticket) => {
  const doc = {
    pageContent: ticket.description,
    metadata: {
      ticketId: ticket._id,
      category: ticket.category,
      priority: ticket.priority,
    },
  };
  await vectorStore.addDocuments([doc]);
  return true;
};

export const addEngineerVector = async (engineer) => {
  const text = `${engineer.name} — dept:${
    engineer.departmentName || ""
  } — expertise: ${engineer.expertise?.join?.(", ") || ""}`;
  const doc = {
    pageContent: text,
    metadata: {
      engineerId: engineer._id,
      department: engineer.departmentName,
      expertise: engineer.expertise,
      name: engineer.name,
      email: engineer.email,
    },
  };
  await vectorStore.addDocuments([doc]);
  return true;
};


export const findMatchingEngineers = async(text,topK=3)=>{
    const results = await vectorStore.similaritySearch(text, topK);
    return results.map((r)=>({
        engineerId:r.metadata?.engineerId,
        score:r.score,
        name:r.metadata?.name,
        content:r.pageContent,
        metadata:r.metadata
    }))
}


export const findSimilarTickets = async(text,topK=3)=>{
    const results = await vectorStore.similaritySearch(text, topK);
    return results.map((r)=>({
        ticketId:r.metadata?.ticketId,
        score:r.score,
        content:r.pageContent,
        metadata:r.metadata
    }))
}