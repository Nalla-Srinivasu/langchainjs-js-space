import { RecursiveCharacterTextSplitter } from "@langchain/classic/text_splitter";
import { Document } from "langchain";

const docs = [
        new Document({
        pageContent:`LangChain.js: A Framework for AI Applications

            LangChain.js is a framework for building applications with large language models.
            It provides a comprehensive set of tools and abstractions that make it easier
            to work with LLMs in production environments.

            Key Features:
            - Model Abstraction: Work with different AI providers using the same interface
            - Prompt Management: Create reusable, testable prompts with templates
            - Document Processing: Load, split, and manage documents efficiently
            - Vector Stores: Store and retrieve embeddings for semantic search
            - Tools: Extend AI capabilities with custom functions and APIs
            - Agents: Build AI systems that can make decisions and use tools
            - Memory: Maintain conversation context across interactions

            The framework is designed to be modular and composable, allowing developers
            to build complex AI applications by combining simple, reusable components.

            Getting Started:
            Install LangChain.js using npm or yarn, configure your API keys, and start
            building AI-powered applications with just a few lines of code.`,
        metadata:{
            source:"lanchain-guide.md",
            category:"tutorial",
            date:"2026-07-15",
            author:"Teach Team",
            tags:["langchain","javascript","ai"]
        }
    }),
    new Document({
        pageContent:`RAG (Retrieval Augmented Generation) systems combine document retrieval with
            language model generation. This approach allows LLMs to access external knowledge
            and provide more accurate, contextual responses without retraining the model.`.trim(),
        metadata:{
            source:"rag-explained.md",
            category:"concept",
            diffculty:"intermediate",
            date:"2026-07-15",
            author:"AI Reasearch Team",
            tags:["rag","retrieval","llm"]
        }
    }),
    new Document({
        pageContent:`Vector databases store embeddings and enable semantic search. Unlike traditional
            keyword search, semantic search understands meaning and context. Popular vector
            databases include Pinecone, Weaviate, and Chroma.`,
            metadata:{
                source:"vector-db-guide.md",
                category:"infrastructure",
                diffculty:"intermediate",
                date:"2026-07-15",
                author:"Data Team",
                tags:["vectors","embeddings","database"]
            }
    })
];

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize:"200",
    chunkOverlap:"20"
});

const splitDocs = await splitter.splitDocuments(docs);

splitDocs.forEach((doc,i)=>{
    console.log(`\nchunk ${i+1}:`)    
    console.log("Content:", doc.pageContent.substring(0, 50) + "...");
    console.log("MetaData:", doc.metadata)
})