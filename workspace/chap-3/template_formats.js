import { ChatPromptTemplate, PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config"
import { mod } from "mathjs";

const model = new ChatOpenAI({
    model: process.env.AI_MODEL,
    configuration: {baseURL:process.env.AI_ENDPOINT},
    apiKey:process.env.AI_API_KEY
})

const template = ChatPromptTemplate.fromMessages([
    ["system","you are  a {role} who speaks in {style} style."],
    ["human","{question}"]
]);

const result1 = await template.pipe(model).invoke({
    role:"Priate",
    style:"dramatic",
    question:"what does senior engineer"
})

console.log("ChatPromptTemplate response : ", result1.content)

const stringTemplate = PromptTemplate.fromTemplate(
    "write a {adjective} {item} about {topic}"
)

const prompt = await stringTemplate.format({
    adjective:"funny",
    item:"poem",
    topic:"senior engineer"
});

console.log("Generated Prompt :", prompt);

const result2 = await model.invoke(prompt);
console.log("\n Response: ", result2.content)
