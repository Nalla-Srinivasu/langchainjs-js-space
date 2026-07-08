import { ChatOpenAI } from "@langchain/openai";
import { AIMessage, HumanMessage, SystemMessage, tool, ToolMessage } from "langchain";
import * as z from "zod"
import"dotenv/config"


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

const model = new ChatOpenAI({
    model:process.env.AI_MODEL,
    configuration:{baseURL:process.env.AI_ENDPOINT},
    apiKey:process.env.AI_API_KEY
})

const query = "what is the weather in delhi?";

const modelwithtool = model.bindTools([weatherTool]);

const response = await modelwithtool.invoke([new HumanMessage(query)]);

// if(!response.tool_calls || response.tool_calls.length === 0){
//     console.log("no tool calls generated")
//     process.exit(1)
// }
// console.log(response.tool_calls[0]);
// process.exit(1)
const toolCall = response.tool_calls[0];
const toolResult = await weatherTool.invoke(weatherTool.schema.parse(toolCall.args));
// console.log(toolResult);
// process.exit(1)
const messages = [
    new HumanMessage(query),
    new AIMessage({content:response.content,tool_calls:response.tool_calls}),
    new ToolMessage({content:String(toolResult),tool_call_id:toolCall.id})
];

const finalResponse = await model.invoke(messages);
console.log("\n With tool configuration :");
console.log("\n Response : ", finalResponse.content);