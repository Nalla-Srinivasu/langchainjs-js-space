import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage,SystemMessage } from "langchain";

import "dotenv/config"

const model = new ChatOpenAI({
    model: process.env.AI_MODEL,
    configuration: {baseURL: process.env.AI_ENDPOINT},
    apiKey: process.env.AI_API_KEY
});

const system_prompt = [
    "You are a pirate. Answer all questions in pirate speak with 'Arrr!' and nautical terms.",
    "You are a professional business analyst. Give precise, data-driven answers.",
    "You are a friendly teacher explaining concepts to 8-year-old children."
];

const question = "What is artificial intelligence?";

for(const item of system_prompt){
    const message = [
        new SystemMessage(item),
        new HumanMessage(question)
    ];

    const response = await model.invoke(message);    
    console.log("AI Act ("+item+") : Question : " + question)
    console.log("AI Response : \n");
    console.log(response.content)
    console.log("\n");
}