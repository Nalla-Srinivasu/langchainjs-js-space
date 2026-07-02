import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage,HumanMessage } from "langchain";
import "dotenv/config"

const model = new ChatOpenAI({
    model:process.env.AI_MODEL,
    configuration:{baseURL: process.env.AI_ENDPOINT},
    apiKey: process.env.AI_API_KEY
});

const message = [
    new SystemMessage("You are a helpful AI Assistant, How does a senior engineer explain things simply?"),
    new HumanMessage("Explain Quantum computing to a 10 yr old?")
];

const response = await model.invoke(message);
console.log(" AI response: \n");
console.log(response.content);