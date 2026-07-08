import { ChatOpenAI } from "@langchain/openai";
import { AIMessage, HumanMessage, SystemMessage, tool, ToolMessage } from "langchain";
import * as z from "zod"
import "dotenv/config"
import { evaluate, mode} from "mathjs";

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

const model = new ChatOpenAI({
    model:process.env.AI_MODEL,
    configuration:{baseURL:process.env.AI_ENDPOINT},
    apiKey:process.env.AI_API_KEY
})

const query = "What is 25 * 17?";

// if(model.profile.toolCalling){
if(false){ // with tool
    const modelwithTools = model.bindTools([calculatorTool]);
    const response =  await modelwithTools.invoke([new HumanMessage(query)]);
    // console.log("Response:", response.tool_calls);    
    const toolcall = response.tool_calls[0];

    const toolResult =  await calculatorTool.invoke(calculatorTool.schema.parse(toolcall.args))
    
    const messages = [
        new HumanMessage(query),
        new AIMessage({content:response.content, tool_calls:response.tool_calls}),
        new ToolMessage({content:String(toolResult),tool_call_id:toolcall.id})
    ]

    const finalResponse = await model.invoke(messages)    
    // console.log("\ntool calls:", response.tool_calls);
    console.log("\n Result: ",finalResponse.content)
}else{ // without tool
    const message = [
        new SystemMessage("You are a mathematician, solve the match problems"),
        new HumanMessage(query),
    ];

    const response = await model.invoke(message);
    console.log("Without tool response :", response.content)
}
// }else{
//     console.log("This model doesn't support tool calling");
    // console.log("\n ", model.profile.supportsToolCalling)
// }