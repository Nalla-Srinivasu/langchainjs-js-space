import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { ChatOpenAI } from "@langchain/openai";
import { createAgent,HumanMessage } from "langchain";
import"dotenv/config";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serverPath = join(__dirname, "servers", "stdio_calculator_servers.js");

const mcpClient = new MultiServerMCPClient({
  localCalculator: {
        transport: "stdio",  // Local subprocess, not HTTP!
        command: "node",
        args:[serverPath]
    }
})

try{

    const model =  new ChatOpenAI({
        model:process.env.AI_MODEL,
        configuration:{baseURL:process.env.AI_ENDPOINT},
        apiKey:process.env.AI_API_KEY
    })
    // console.log(serverPath);
    // process.exit(1);
    const tools = await mcpClient.getTools();
    const agent = await new createAgent({
        model,
        tools
    })

    const query = "What is the value of 25*30?"

    const response = await agent.invoke({messages: new HumanMessage(query)})
    const lastMessage = response.messages[response.messages.length - 1];

    console.log("\n query", query);
    console.log("\n agent respones", lastMessage.content)
}catch(error){
    console.error("error connecting to local mcp server:", error)
}finally{
    await mcpClient.close();
    console.log("\n mcp client connection closed")
}