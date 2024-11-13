
const { ChatOllama } = require("@langchain/ollama");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { Document } = require("langchain/document");
const { createStuffDocumentsChain } = require("langchain/chains/combine_documents");
const { createRetrievalChain } = require("langchain/chains/retrieval");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { OllamaEmbeddings } = require("@langchain/ollama");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const { StructuredOutputParser } = require("langchain/output_parsers");
const fs = require('fs');
const {StringOutputParser} = require("@langchain/core/output_parsers");

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

const prompt = ChatPromptTemplate.fromTemplate(
    `
    You are an email assistant named "Otter", responding on behalf of Vivek. Use the provided context to respond in a single, concise reply that directly answers the question.

    If the email contains any sensitive keywords like "${sensitiveKeywords.join(', ')}", respond with a message that invites the sender to meet in person. Format your reply in JSON structure, with these keys:

    {{
        "subject": "A concise, relevant subject line tailored to the received email.",
        "greeting": "Dear {sender}",
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

const responseGenerator = async (senderName , senderEmail) => {
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

    const embeddings = new OllamaEmbeddings({
        model: "llama3.2:1b",
        temperature: 0.5
    });

    const vectorStore = await MemoryVectorStore.fromDocuments(
        splitDocs,
        embeddings,
    );


    const retriever = vectorStore.asRetriever({
        k: 1,
    });

    const output_parsers = new StructuredOutputParser();

    
    const retrievalChain = await createRetrievalChain({
        combineDocsChain: chain,
        retriever: retriever,
        outputParsers: output_parsers,
    });

    const response = await retrievalChain.invoke({
        sender: senderName,
        input: senderEmail
    });
    console.log("unJson answer");
    console.log(response.answer);
    const finalAns = (JSON.parse(response.answer));
    console.log("final Answer");
    console.log(finalAns);
    return finalAns;
};

// Wrap test code in an async IIFE to support top-level await
// (async () => {
//     const sender = "Nemo";
//     const input = "Good morning Sir, I want to meet you. Can you share your free time slot on Wednesday?";
//     const responseTest = await responseGenerator(sender, input);
//     console.log(responseTest);
// })();

module.exports = { responseGenerator }   