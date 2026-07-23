import { QdrantClient } from "@qdrant/js-client-rest";

const client = new QdrantClient({host:"localhost",port:6333});

const create_collection =  await client.createCollection("documents",{
    vectors:{size:1536,distance:"Cosine"}
})