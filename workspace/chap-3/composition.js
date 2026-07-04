import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config"

const model = new ChatOpenAI({
    model: process.env.AI_MODEL,
    configuration:{baseURL:process.env.AI_ENDPOINT},
    apiKey:process.env.AI_API_KEY
});

const systemMessage = "You are a expert {domain} educator.";
const contextMessage = "Teaching level: {level}\nAudience:{audience}"
const tasktemplate = "Explain {topic} in simple term."

const fullTemplate = ChatPromptTemplate.fromMessages([
    ["system",systemMessage + "\n\n"+contextMessage],
    ["human", tasktemplate]
]);

const chain = fullTemplate.pipe(model)

const result1 = await chain.invoke({
    domain:"programming",
    level:"Begineer",
    audience:"higher school students",
    topic:"promises"
})

const result2 = await chain.invoke({
    domain:"programming",
    level:"intermediate",
    audience:"college students",
    topic:"objects"
})

console.log("AI response to result1 \n ", result1.content)
console.log("AI response to result2\n ", result2.content)