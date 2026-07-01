 import { ChatOpenAI } from "@langchain/openai";
 import "dotenv/config"

 const model = new ChatOpenAI({
    model: process.env.AI_MODEL,
    configuration:{ baseURL: process.env.AI_ENDPOINT },
    apiKey: process.env.AI_API_KEY,
    verbose:true,
 });

const response = await model.invoke("Hello! How are you?");
console.log("AI response : ", response)
// for await(const chunk of response){
//     console.log(chunk)
// }