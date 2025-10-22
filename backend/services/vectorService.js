
import { PineconeStore } from "@langchain/pinecone";
import { embeddings } from "./embeddingService.js";
import { pineconeIndex } from "./pineconeClient.js";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

let vectorStore;

try {
  console.log("Initializing vector store...");
  vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    
    maxConcurrency: 5,
  });
  console.log("Vector store initialized successfully");
} catch (error) {
  console.error("Error initializing vector store:", error.message);
  vectorStore = null;
}

export const addTicketVector = async (ticket) => {
  try {
    if (!vectorStore) throw new Error("Vector store not initialized");

    const doc = {
      pageContent: ticket.description,
      metadata: {
        ticketId: ticket._id,
        category: ticket.category,
        priority: ticket.priority,
      },
    };

    await vectorStore.addDocuments([doc]);
    console.log(`Ticket vector added for ticket: ${ticket._id}`);
    return true;
  } catch (error) {
    console.error("Error adding ticket vector:", error.message);
    return false; 
  }
};

export const addEngineerVector = async (engineer) => {
  try {
    if (!vectorStore) throw new Error("Vector store not initialized");

    const text = `${engineer.name} — dept:${
      engineer.departmentName || ""
    } — expertise: ${engineer.expertise?.join?.(", ") || ""}`;

    const doc = {
      pageContent: text,
      metadata: {
        engineerId: engineer._id.toString(),
        department: engineer.departmentName,
        expertise: engineer.expertise,
        name: engineer.name,
        email: engineer.email,
      },
    };

    await vectorStore.addDocuments([doc]);
    console.log(`Engineer vector added for: ${engineer.name}`);
    return true;
  } catch (error) {
    console.error("Error adding engineer vector:", error.message);
    return false;
  }
};

export const findMatchingEngineers = async (text, topK = 3) => {
  try {
    if (!vectorStore) throw new Error("Vector store not initialized");

    const results = await vectorStore.similaritySearch(text, topK);
    return results.map((r) => ({
      engineerId: r.metadata?.engineerId,
      score: r.score,
      name: r.metadata?.name,
      content: r.pageContent,
      metadata: r.metadata,
    }));
  } catch (error) {
    console.error("Error finding matching engineers:", error.message);
    return [];
  }
};

export const findSimilarTickets = async (text, topK = 3) => {
  try {
    if (!vectorStore) throw new Error("Vector store not initialized");

    const results = await vectorStore.similaritySearch(text, topK);
    return results.map((r) => ({
      ticketId: r.metadata?.ticketId,
      score: r.score,
      content: r.pageContent,
      metadata: r.metadata,
    }));
  } catch (error) {
    console.error("Error finding similar tickets:", error.message);
    return [];
  }
};
