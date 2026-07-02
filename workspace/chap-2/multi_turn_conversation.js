import { ChatOpenAI } from "@langchain/openai";
import { AIMessage, BaseMessage, HumanMessage,SystemMessage } from "langchain";
import "dotenv/config"

const model = new ChatOpenAI({
    model: process.env.AI_MODEL,
    configuration: {baseURL:process.env.AI_ENDPOINT},
    apiKey: process.env.AI_API_KEY
});
/** @type {import('./types').BaseMessage[]} */
var messages = [
    new SystemMessage("you are a helpful coding tutor who gives clear, concise explanations."),
    new HumanMessage("What is typescript?")
]
console.log("AI behaviour :you are a helpful coding tutor who gives clear, concise explanations." )
console.log("\nUser Question 1: What is typescript?\n")

const response1 = await model.invoke(messages);
console.log("\nAi response 1 :", response1.content)
messages.push(new AIMessage(response1.content))
// BaseMessage = messages

console.log("\n User Question 2: Can you show me sample example for better to understanding")
messages.push(new HumanMessage("Can you show me sample example for better to understanding"))
const response2 = await model.invoke(messages);
console.log("\nAi response 2 :", response2.content)
messages.push(new AIMessage(response2.content))
// BaseMessage = messages

console.log("\n User Question 2: What are the benefits compared to JavaScript?")
messages.push(new HumanMessage("What are the benefits compared to JavaScript?"))
const response3 = await model.invoke(messages);
console.log("\nAi response 3 :", response3.content)
messages.push(new AIMessage(response3.content))
// BaseMessage = messages

console.log(`📊 Total messages in history: ${messages.length}`);


