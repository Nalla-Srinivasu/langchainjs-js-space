import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { ChatOpenAI } from "@langchain/openai";
import { createAgent,HumanMessage } from "langchain";
import "dotenv/config"
import { error } from "node:console";

const mcpclient =  new MultiServerMCPClient({
    context7:{
        transport:"http",
        url:"https://mcp.context7.com/mcp"
    }
})

try{
    const tools = await mcpclient.getTools();

    console.log("Retrived the tools from contex7 service/server")
    tools.forEach(tool =>{
        console.log(`${tool.name} - ${tool.description}`)
    })

    const model =  new ChatOpenAI({
        model:process.env.AI_MODEL,
        configuration:{baseURL:process.env.AI_ENDPOINT},
        apiKey:process.env.AI_API_KEY
    })

    const agent = await new createAgent({
        tools,
        model
    });

    const query = "what is difference useState and useEffect? how to use these hooks"

    const response = await agent.invoke({messages: new HumanMessage(query)})
    const latest_message = response.messages[response.messages.length - 1]

    console.log("\n query : ",query);
    console.log("\n Agent response: ",latest_message.content)
}catch(error){
    console.error("error connecting to context7 mcp server:", error)
}finally{
    await mcpclient.close();
    console.log("\n mcp client connetion closed")
}