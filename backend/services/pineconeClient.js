import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import dotenv from "dotenv";
dotenv.config({quiet: true});

const pinecone = new PineconeClient({
  apiKey: process.env.PINECONE_API_KEY,
});

export const pineconeIndex = pinecone.Index("ticket-match");
