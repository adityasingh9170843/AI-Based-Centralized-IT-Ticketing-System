import { PineconeStore } from "@langchain/pinecone";
import { embeddings } from "./embeddingService";
import { pineconeIndex } from "./pineconeClient";
import dotenv from "dotenv";
dotenv.config({quiet: true});

const pinecone = new PineconeStore({
    apiKey: process.env.PINECONE_API_KEY,
});

export const vectorStore = await PineconeStore.fromExistingIndex(embeddings,{
   pineconeIndex,
   maxConcurrency: 5
});