const { ChatOllama } = require("@langchain/ollama");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { Document } = require("@langchain/core/documents");
const { createStuffDocumentsChain } = require("langchain/chains/combine_documents");
const { createRetrievalChain } = require("langchain/chains/retrieval");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { OllamaEmbeddings } = require("@langchain/ollama");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const { StructuredOutputParser } = require("langchain/output_parsers");
const { Chroma } = require("@langchain/community/vectorstores/chroma");
const dotenv = require("dotenv").config();



const fs = require('fs');


const model = new ChatOllama({
    model: "llama3.2:1b",
    temperature: 0.5
});

const loadContext = () => {
    const context = fs.readFileSync('/Users/vivek/Desktop/SmartInBox/ResponseService/context.txt', 'utf-8');
    // console.log(typeof(context));
    console.log("Context Loaded.")
    return context;
};


const sensitiveKeywords = [
    "bullying", 
    "ragging", 
    "need help", 
    "problems", 
    "struggling", 
    "harassment", 
    "abuse", 
    "threats", 
    "isolation", 
    "neglect", 
    "anxiety", 
    "depression", 
    "crisis", 
    "trauma", 
    "conflict", 
    "discrimination", 
    "emotional distress", 
    "suicidal thoughts", 
    "peer pressure", 
    "overwhelmed", 
    "burnout", 
    "mental health issues", 
    "substance abuse", 
    "exclusion",  
    "violence"
];
// async function generateEmbeddingsForDocs(documents) {
//     const embeddingsModel = new OllamaEmbeddings({
//         model: "llama3.2:1b",
//         temperature: 0.5,
//     });

//     const embeddingsArray = [];
//     for (const doc of documents) {
//         const text = doc.pageContent;  // Extract text content from each Document
//         const embedding = await embeddingsModel.embedQuery(text);
//         embeddingsArray.push(embedding);
//     }
//     console.log("Generated Embeddings for Documents:", embeddingsArray);
//     return embeddingsArray;
// }


const prompt = ChatPromptTemplate.fromTemplate(
    `
    You are an email assistant named "Otter", responding on behalf of Vivek. Use the provided context to respond in a single, concise reply that directly answers the question.

    If the email contains any sensitive keywords like "${sensitiveKeywords.join(', ')}", respond with a message that invites the sender to meet in person. Format your reply in JSON structure, with these keys:

    {{
        "subject": "A concise, relevant subject line tailored to the received email.",
        'greeting": "Dear {sender}",
        "body": "The main response content that addresses the sender's question",
        "signature": "Best regards, Vivek Shaurya"
    }}

    Context about Vivek:
    {context}

    Sender's Name:
    {sender}

    Email received:
    {input}

    Respond as Vivek:
    `
);

const setup = async () => {


    const chain = await createStuffDocumentsChain({
        llm: model,
        prompt,
    });

    const doc = loadContext();
    // console.log(doc);

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 100000,
        chunkOverlap: 0
    });

    const splitDocs = (await splitter.splitText(doc)).map(content => new Document({ pageContent: content }));

    console.log("Splitted Docs:-"+splitDocs);

    const embeddings = new OllamaEmbeddings({
        model: "llama3.2:1b",
        temperature: 0.5
    });
    // const embeddingsArray =  await generateEmbeddingsForDocs(splitDocs); 

    // const vectorStore = new Chroma(
    //     embeddings,
    //     {
    //       collectionName: "UserEmbeddings",
    //       url: "http://localhost:8069", // URL of the Chroma server
    //       numDimensions: 2048,
    //       collectionMetadata: {
    //         "hnsw:space": "cosine",
    //       },
    //     }
    //   );      

      async function hello() {
        const collection = await client.getOrCreateCollection({
          name: "UserEmbeddings",
          embeddingFunction: embeddings
        });
      }
      const ids = [];
  const documents = [];
  const metadatas = [];
  splitDocs.forEach((article) => {
      ids.push(article.id);
      documents.push(article.document);
      metadatas.push({
        title: article.title,
        url: article.url
      });
  });

  // Add documents to collection
  const result = await collection.add({
      ids,
      documents,
      metadatas
  });

  console.log('result', result);

  hello();
    // const document1 = { pageContent: "foo", metadata: { baz: "bar" } };
    // const document2 = { pageContent: "thud", metadata: { bar: "baz" } };
    // const document3 = { pageContent: "i will be deleted :(", metadata: {} };

    // const documents = [document1, document2, document3];
    // const ids = ["1", "2", "3"];

    // await vectorStore.addDocuments(documents, { ids });
    // await vectorStore.addDocuments(splitDocs);
    // const retriever = vectorStore.asRetriever({
    //     searchType: "similarity", // Leave blank for standard similarity search
    //     k: 1,
    // });
    // const testQuery = "some query text"; // Example text to test retrieval
    // const results = await retriever.invoke(testQuery);
    // console.log("Retriever Results:", results);
    // const resultAsRetriever = await retriever.invoke("thud");
    // console.log(resultAsRetriever);

    // const retrievalChain = await createRetrievalChain({
    //     combineDocsChain: chain,
    //     retriever,
    // });

    // const response = await retrievalChain.invoke({
    //     sender: "Nemo",
    //     input: "Good morning Sir, I want to meet you can you share you free time slot on wednesday?",
    // });

    // console.log(response);
};

setup().catch(console.error);