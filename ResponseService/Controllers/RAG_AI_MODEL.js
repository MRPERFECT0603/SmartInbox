
const { ChatOllama } = require("@langchain/ollama");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { Document } = require("langchain/document");
const { createStuffDocumentsChain } = require("langchain/chains/combine_documents");
const { createRetrievalChain } = require("langchain/chains/retrieval");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { OllamaEmbeddings } = require("@langchain/ollama");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const fs = require('fs');

const model = new ChatOllama({
    model: "llama3.2:1b",
    temperature: 0.5
});

const loadContext = () => {
    const context = fs.readFileSync('/Users/vivek/Desktop/SmartInBox/ResponseService/context.txt', 'utf-8');
    console.log(typeof(context));
    return context;
};

const prompt = ChatPromptTemplate.fromTemplate(
    `
    You are an email assistant named "Otter", responding on behalf of Vivek. Your role is to reply to emails as if you are Vivek, using his provided context.

    Context about Vivek:
    {context}

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
    console.log(doc);

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 200,
        chunkOverlap: 20
    });

    const splitDocs = (await splitter.splitText(doc)).map(content => new Document({ pageContent: content }));

    const embeddings = new OllamaEmbeddings({
        model: "llama3.2:1b",
        temperature: 0.2
    });

    const vectorStore = await MemoryVectorStore.fromDocuments(
        splitDocs,
        embeddings
    );

    const retriever = vectorStore.asRetriever({
        k: 2,
    });

    const retrievalChain = await createRetrievalChain({
        combineDocsChain: chain,
        retriever: retriever
    });

    const response = await retrievalChain.invoke({
        input: "Good Morning sir, I am new to your course can you please clarify what this course is all about?",
    });

    console.log(response);
};

setup().catch(console.error);