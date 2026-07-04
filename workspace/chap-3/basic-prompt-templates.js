import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import "dotenv/config";

const model = new ChatOpenAI({
    model:process.env.AI_MODEL,
    configuration:{baseURL:process.env.AI_ENDPOINT},
    apiKey:process.env.AI_API_KEY
})

const template = ChatPromptTemplate.fromMessages([
    ["system","you ara a helpful assitant that transalates {input_language} to {output_language}."],
    ["human","{text}"]
])

const chain = template.pipe(model)

const result1 = await chain.invoke({
    input_language : "English",
    output_language : "French",
    text:"hello who are you?"
});

console.log("\n French language : ", result1.content);

const result2 = await chain.invoke({
    input_language : "English",
    output_language : "Telugu",
    text:"hello who are you?"
});

console.log("\n Telugu language : ", result2.content);