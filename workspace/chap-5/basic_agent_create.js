import { ChatOpenAI } from "@langchain/openai";
import"dotenv/config"
import { createAgent, HumanMessage,tool } from "langchain";
import { evaluate } from "mathjs";
import * as z from "zod";


const calculatorTool = tool(
    async(input)=>{
        const result = evaluate(input.expression)
        return String(result)
    },
    {
        name:"Calculator",
        description:"A calculator that can perform basic arthmetic operations.",
        schema:z.object({
            expression:z.string().describe("The Mathmetical expression to evaluate"),
        })
    }
)

const model = new ChatOpenAI({
    model:process.env.AI_MODEL,
    configuration:{baseURL:process.env.AI_ENDPOINT},
    apiKey:process.env.AI_API_KEY
});

const agent = createAgent({
    model,
    tools:[calculatorTool]
});

const queries = [
    "what is 25 * 7?",
    "check if 425 is prime?"
];

for(const query  of queries){
    const response =  await agent.invoke({messages:new HumanMessage(query)})    
    const lastMessage = response.messages[response.messages.length - 1];
    console.log(`query: ${query}`)
    console.log(`\nAgent: ${lastMessage.content}\n`)
}
