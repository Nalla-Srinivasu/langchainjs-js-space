import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "langchain";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import "dotenv/config"

const model = new ChatOpenAI({
    model: process.env.AI_MODEL,
    configuration: {baseURL: process.env.AI_ENDPOINT},
    apiKey: process.env.AI_API_KEY
})

console.log("APPROACH 1: Message Arrays\n");
const message = [
    new SystemMessage("You are a helpful translator"),
    new HumanMessage("Translate 'Hello world!' to french"),
];

const Messageresponse = await model.invoke(message);
console.log("Response: ", Messageresponse.content)

console.log("\nAPPROACH 2: Prompt templates\n");

const template = ChatPromptTemplate.fromMessages([
    ["system", "You are a helpful translator"],
    ["human", "Translate '{text}' to {language}"]
]);

const templateChain = template.pipe(model);
const templateResponse = await templateChain.invoke({
    text:"Hello world",
    language:"French",
})

console.log("\n Response : ", templateResponse.content)