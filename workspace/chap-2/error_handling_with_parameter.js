import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";


const model = new ChatOpenAI({
    model: process.env.AI_MODEL,
    configuration: {baseURL: process.env.AI_ENDPOINT},
    apiKey: process.env.AI_API_KEY,
    temperature: 1,
    maxTokens:20
});

const model_with_retry = model.withRetry({
    stopAfterAttempt: 3
});

try{
    console.log("Making API call with automatic retry \n")
    const response = await model_with_retry.invoke("What is langchain.js")
    const usage = response.usage_metadata;


    console.log("\nToken Breakdown");
    console.log(`prompt tokens : ${usage.input_tokens}\n`)
    console.log(`response tokens : ${usage.output_tokens}\n`)
    console.log(`Total tokens : ${usage.total_tokens}\n`)



    console.log("AI response : ", response.content)
    console.log("\n")
}catch(error){
    callback(new Error("Invalid JS :", error))

    if(error.messsage.includes("429")){
        console.log("\n rate limit hit. try agin in few moments")
    }
}