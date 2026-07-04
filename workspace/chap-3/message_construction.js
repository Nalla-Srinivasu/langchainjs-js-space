import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage,HumanMessage,AIMessage,BaseMessage } from "langchain";
import "dotenv/config"
import { mod } from "mathjs";

const model = new ChatOpenAI({
    model:process.env.AI_MODEL,
    configuration:{baseURL:process.env.AI_ENDPOINT},
    apiKey: process.env.AI_API_KEY
})


function createConversation(role, examples,newQuestion){
    const messages = [
        new SystemMessage("You are a ${role}.")
    ];

    examples.forEach(({question,answer}) => {
        messages.push(new HumanMessage(question));
        messages.push(new AIMessage(answer));
    });

    messages.push(new HumanMessage(newQuestion))
    return messages
}

const emojiMessages = createConversation(
    "emoji translator",
    [
        {question:"hapyy",answer:"😊"},
        {question:"sad", answer:"😢"},
        {question:"excited",answer:"🎉"}
    ],
    "surprised",
);

console.log("Messages constructed:", emojiMessages.length);
const response =  await model.invoke(emojiMessages);
console.log("\n AI response:", response.content);