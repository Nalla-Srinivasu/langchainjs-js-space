import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
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

const context = searchResult.points.map(point => point.payload.text).join("\n\n")

// console.log("context", context)
// process.exit(0);

const llm = new ChatOpenAI({
    model:process.env.AI_MODEL,
    configuration:{baseURL:process.env.AI_ENDPOINT},
    apiKey:process.env.AI_API_KEY
})

const prompt = ChatPromptTemplate.fromMessages([
    ["system",`You are a helpful AI assistant.

Use the provided context to answer the user's question.

The wording of the question does not have to exactly match the context. If the context contains semantically similar or equivalent information, use it to answer the question.

Do not copy the context word for word unless necessary. Generate a clear and natural response based on the retrieved context.

If the context does not contain enough information to answer the question, respond only with:
"I don't know."`],
    [
        "human",
        `
            Context:
            {context}

            Question:
            {question}

            Answer:
        `
    ]
])

const finalPrompt = await prompt.invoke({context,question})
// console.dir(finalPrompt.messages, { depth: null });
// process.exit(0);
const response = await llm.invoke(finalPrompt)

console.log("response", response.content)
// console.dir(response, { depth: null });