import { ChatOpenAI } from "@langchain/openai";
import"dotenv/config";
import { AIMessage, HumanMessage, ToolMessage, tool } from "langchain";
import { evaluate, mod } from "mathjs";

import * as z from "zod"

const model = new ChatOpenAI({
    model:process.env.AI_MODEL,
    configuration:{baseURL:process.env.AI_ENDPOINT},
    apiKey:process.env.AI_API_KEY
})

const queries = [
    "what is the 9*5+5?",
    "what is the weather in hyderabad?"
];

const calculatorTool = tool(
    async(input) => {
        try{
            const result = evaluate(input.expression);
            return `The result is: ${result}`;
        }catch(error){
            return `Error evaluating expression: ${error instanceof Error? error.message:String(error)}`
        }
    },
    {
        name:"Calculator",
        description:"Useful for performing mathematical calculations. use this when you need to compute numbers.",
        schema:z.object({
            expression:z.string().describe("The mathematical expression to evaluate, e.g '25 * 4'")
        }),
    }
);


const weatherTool = tool(
    async(input)=>{
        const temps = {delhi:30,kakinada:18,hyderabad:25,kolkata:28};
        const temp = temps[input.city] || 72;
        return `Current temperature in ${input.city} : ${temp} F`
    },
    {
        name:"getWeather",
        description:"Get current weather of city",
        schema:z.object({
            city:z.string().describe("city name"),
        }),
    }
)

const modelwithtool = model.bindTools([calculatorTool,weatherTool])

for(const query of queries){
    const response = await modelwithtool.invoke(new HumanMessage(query));
    const toolCall = response.tool_calls[0]
    const toolResult = await modelwithtool.invoke(modelwithtool.schema.parse(toolCall.args))

    const messages = [
        new HumanMessage(query),
        new AIMessage({content:response.content,tool_calls:response.tool_calls}),
        new ToolMessage({content:String(toolResult),tool_call_id:toolCall.id})
    ];

    const eachResponse = await model.invoke(messages)

    console.log("\n query : ",query )
    console.log("\n Response : ",eachResponse )
}