import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantClient } from "@qdrant/js-client-rest";
import "dotenv/config"

const EmbeddingModel = new OpenAIEmbeddings({
    model:process.env.AI_EMBEDDING_MODEL,
    configuration:{baseURL:process.env.AI_ENDPOINT},
    apiKey:process.env.AI_API_KEY
});

const qdrant_client = new QdrantClient({host:"localhost",port:6333});

const question = "what is langchain.js?";

const queryVector = await EmbeddingModel.embedQuery(question);

const searchResult = await qdrant_client.query("documents",{
    query:queryVector,
    limit:3,
    with_payload:true
})
