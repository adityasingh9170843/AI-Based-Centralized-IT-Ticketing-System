import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";


const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004", 
  task: TaskType.TEXT_EMBEDDING,
  apiKey: process.env.GOOGLE_GENAI_API_KEY
});

export default embeddings

