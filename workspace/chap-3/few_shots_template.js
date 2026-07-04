import { ChatPromptTemplate, FewShotChatMessagePromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config"

const model = new ChatOpenAI({
    model:process.env.AI_MODEL,
    configuration:{baseURL:process.env.AI_ENDPOINT},
    apiKey:process.env.AI_API_KEY
});

const examples = [
    {input: "happy", output:"😊"},
    { input: "sad", output: "😢" },
    { input: "excited", output: "🎉" },
]

const exampleTemplate = ChatPromptTemplate.fromMessages([
    ["human","{input}"],
    ["ai","{output}"]
]);

const fewShotTemplate = new FewShotChatMessagePromptTemplate({
    examplePrompt:exampleTemplate,
    examples: examples,
    inputVariables: [],
});

const finalTemplate = ChatPromptTemplate.fromMessages([
    ["system","Convert emotions to emojis based on these examples:"],
    fewShotTemplate,
    ["human","{input}"]
])

const chain =  finalTemplate.pipe(model);

const result1 =  await chain.invoke({input:"surprised"});
console.log("surprised emoji : ", result1.content);

const result2 =  await chain.invoke({input:"lonely"});
console.log("surprised emoji : ", result2.content);

