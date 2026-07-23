import { TextLoader } from "@langchain/classic/document_loaders/fs/text";


const loader = new TextLoader("./data/sample.txt");
const docs = await loader.load();

console.log("Loaded documents:", docs.length);
console.log("Content:", docs[0].pageContent);
console.log("Meta data:", docs[0].metadata);