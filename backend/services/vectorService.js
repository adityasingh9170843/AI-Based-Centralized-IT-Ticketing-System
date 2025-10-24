import { PineconeStore } from "@langchain/pinecone";
import { embeddings } from "./embeddingService.js";
import { engineerIndex,ticketIndex } from "./pineconeClient.js";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

let engineerStore,ticketStore;

try {
  console.log("Initializing vector store...");
  engineerStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex: engineerIndex,
    maxConcurrency: 5,
  });

  ticketStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex: ticketIndex,
    maxConcurrency: 5,
  });
  console.log("Vector store initialized successfully");
} catch (error) {
  console.error("Error initializing vector store:", error.message);
  vectorStore = null;
}

export const addTicketVector = async (ticket) => {
  try {
    if (!ticketStore) throw new Error("Vector store not initialized");

    const doc = {
      pageContent: ticket.description,
      metadata: {
        ticketId: ticket._id.toString(),
        category: ticket.category,
        priority: ticket.priority,
      },
    };

    await ticketStore.addDocuments([doc]);
    console.log(`Ticket vector added for ticket: ${ticket._id}`);
    return true;
  } catch (error) {
    console.error("Error adding ticket vector:", error.message);
    return false; 
  }
};

export const addEngineerVector = async (engineer) => {
  try {
    if (!engineerStore) throw new Error("Vector store not initialized");

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

    await engineerStore.addDocuments([doc]);
    console.log(`Engineer vector added for: ${engineer.name}`);
    return true;
  } catch (error) {
    console.error("Error adding engineer vector:", error.message);
    return false;
  }
};

export const findMatchingEngineers = async (text, topK = 3) => {
  try {
    if (!engineerStore) throw new Error("Vector store not initialized");

    const results = await engineerStore.similaritySearch(text, topK);
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
    if (!ticketStore) throw new Error("Vector store not initialized");

    const results = await ticketStore.similaritySearch(text, topK);
    return results.map((r) => ({
      ticketId: r.metadata?.ticketId.toString(),
      score: r.score,
      content: r.pageContent,
      metadata: r.metadata,
    }));
  } catch (error) {
    console.error("Error finding similar tickets:", error.message);
    return [];
  }
};
