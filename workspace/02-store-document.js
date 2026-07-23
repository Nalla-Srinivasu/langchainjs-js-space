import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantClient } from "@qdrant/js-client-rest";
import "dotenv/config"

const EmbeddingModel = new OpenAIEmbeddings({
    model:process.env.AI_EMBEDDING_MODEL,
    configuration:{baseURL:process.env.AI_ENDPOINT},
    apiKey:process.env.AI_API_KEY
});

const qdrant_client = new QdrantClient({host:"localhost",port:6333});

const text = "LangChain is an AI framework for building LLM applications.";

const allEmbedding = await EmbeddingModel.embedDocuments([text]);

console.log("embedding text",allEmbedding);

console.log(allEmbedding.length);

console.log(allEmbedding[0].length);

console.log(Array.isArray(allEmbedding));

console.log(Array.isArray(allEmbedding[0]));

const payloadData = {
    wait:true,
    points: [
        {
            id : 1,
            vector:allEmbedding[0],
            payload:{
                text:text
            }
        }
    ]
};
const insert_data = qdrant_client.upsert("documents",payloadData);