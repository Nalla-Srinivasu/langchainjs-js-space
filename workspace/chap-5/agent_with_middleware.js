import { ChatOpenAI } from "@langchain/openai";
import"dotenv/config"
import { createAgent, createMiddleware, HumanMessage, tool } from "langchain";
import { evaluate } from "mathjs";
import * as z from "zod"

const model = new ChatOpenAI({
    model:process.env.AI_MODEL,
    configuration:{baseURL:process.env.AI_ENDPOINT},
    apiKey:process.env.AI_API_KEY
});


// tools
const calCulatorTool = tool(
    async(input) => {
        const result = evaluate(input.expression)
        return String(result)
    },
    {
        name:"Calculator",
        description:"A Calculator that can perform basic arthmetic operations",
        schema:z.object({
            expression:z.string().describe("The mathmetical expression to evaluate")
        })
    }
)

const weatherTool = tool(
    async(input)=>{
        const cityTemps = {
            Delhi: "62°F, cloudy with a chance of rain",
            Mumbai: "18°C, sunny and pleasant",
            Chennai: "24°C, rainy with occasional thunder",
            Hyderabad: "70°F, partly cloudy",
            Vizag: "15°C, foggy with light drizzle",
        }

        const cityWeather = cityTemps[input.city];
        return cityWeather
      ? `Current weather in ${input.city}: ${cityWeather}`
      : `Weather data unavailable for ${input.city}`;
    },
    {
        name:"getWeather",
        description:"Get current weather information for a specific city",
        schema:z.object({
            city:z.string().describe("The name of the city to get weather")
        })
    }
)

const searchTool = tool(
    async(input)=>{
        const searchResults = {
            "LangChain.js": "LangChain.js is a framework for building applications with large language models (LLMs). It provides tools, agents, chains, and memory systems to create sophisticated AI applications.",
            TypeScript: "TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.",
            "JavaScript frameworks": "Popular JavaScript frameworks include React, Vue, Angular, Svelte, and Next.js for building modern web applications.",
        }

        let bestMatch = `search results for "${input.query}": Found information about web development, programming, and related topics.`;

        for(const [key,value] of Object.entries(searchResults)){
            if(input.query.toLowerCase().includes(key.toLowerCase())){
                bestMatch = `search results for "${input.query}": ${value}`;
                break;
            }
        }

        return bestMatch;
    },
    {
        name:"search",
        description:"",
        schema:z.object({
            query:z.string().describe("The search query")
        })
    }
)

// middleware agent

const dynamicModelSelection = createMiddleware({
    name:"DynamicModelSelection",
    wrapModelCall:(request, handler) => {
        const messgaeCount = request.messages.length;
        if(messgaeCount > 10){
            console.log(`  [Middleware] Switching to more capable model`)
            return handler({
                ...request,
                model:capableModel
            })
        }

        return handler(request);
    }
})

const toolErrorHandler = createMiddleware({
    name:"ToolErrorHandler",
    wrapModelCall:async(request,handler)=>{
        try{
            return await handler(request);            
        }catch(error){
            console.error(`  [Middleware] Tool "${request.tool}" failed`)

            return{
                content: `I encountered an error: ${error.message}. let me try a different approach.`
            }
        }
    }
})

const agent = createAgent({
    model,
    tools:[calCulatorTool,weatherTool,searchTool],
    middleware:[dynamicModelSelection,toolErrorHandler]
})

const queries = [
    "what is the 25 * 25?",
    "Search for information about error handling",
    // "Tell me about NodeJs?"
]
let i = 1;
for(const query of queries){
    const response = await agent.invoke({messages: new HumanMessage(query)})
    const lastMessage = response.messages[response.messages.length - 1];
    console.log(`Test ${i}`)
    console.log(`\nquery : ${query}`);
    console.log(`\nAgent response : ${lastMessage.content}\n`);
    i++;
}
