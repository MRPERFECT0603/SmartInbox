




/*

THIS IS AN OLDER VERSION USING LANGCHAIN AND OLLAMA TO CREATE THE AI AGENT FOR RESPONSE AND RAG MODEL.



*/
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
const Context = require("../Models/ContextModel");


const model = new ChatOllama({
    model: "llama3.2:1b",
    temperature: 0.5,
    // baseUrl: "http://192.168.65.3:30007"
});

/*
LoadContext from the file System Version 1 of the model
*/
// const loadContext = () => {
//     const context = fs.readFileSync('/Users/vivek/Desktop/SmartInBox/ResponseService/context.txt', 'utf-8');
//     // console.log(typeof(context));
//     console.log("Context Loaded.")
//     return context;
// };


/*

*/
/**
 * Loads a context document from MongoDB for a given user email.
 *
 * This function retrieves the context document associated with the specified email from the `Context` collection.
 * If the context document is found, it validates that the `context` field is a string before returning it.
 *
 * @async
 * @function loadContext
 * @param {string} userEmail - The email address of the user whose context needs to be loaded.
 * @returns {Promise<string>} The context string associated with the provided email.
 * @throws {Error} Throws an error in the following cases:
 * - If no context document is found for the given email.
 * - If the `context` field in the retrieved document is not a valid string.
 * - If an unexpected error occurs during the database query.
 */
const loadContext = async (userEmail) => {
    try {
        const contextDoc = await Context.findOne({ email: userEmail });

        if (!contextDoc) {
            throw new Error('Context not found for this sender email');
        }

        const context = contextDoc.context;

        if (typeof context !== 'string') {
            throw new Error('Context is not a valid string');
        }

        console.log("Context Loaded from MongoDB.");
        console.log("Context content:", context);
        return context;
    } catch (error) {
        console.error('Error loading context:', error);
        throw error;
    }
};
/**
 * A list of sensitive keywords used to identify critical or concerning topics.
 *
 * This array contains terms related to issues such as mental health, harassment, abuse, 
 * and other distressing situations. It is intended to be used in applications that need 
 * to detect and respond to sensitive or urgent matters, such as content moderation, 
 * sentiment analysis, or support systems.
 */

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

/**
 * ChatPromptTemplate configuration for generating email responses as an assistant.
 *
 * This prompt template is designed for an email assistant named "Otter," who responds 
 * on behalf of Vivek. The assistant generates concise replies tailored to the received 
 * email, based on the provided context and sender's name. It incorporates the detection 
 * of sensitive keywords to handle potentially critical topics differently.
 *
 * If the received email contains sensitive keywords (from `sensitiveKeywords`), 
 * the response invites the sender to meet in person. Otherwise, the assistant creates 
 * a relevant reply addressing the sender's query.
 *
 * The reply is structured in JSON format with the following keys:
 * - **subject**: A concise, relevant subject line based on the email.
 * - **greeting**: A personalized greeting addressing the sender.
 * - **body**: The main content of the response, directly answering the query.
 * - **signature**: A closing line signed as "Vivek Shaurya."
 */
const prompt = ChatPromptTemplate.fromTemplate(
    `
    You are an email assistant named "Otter", responding on behalf of Vivek. Use the provided context to respond in a single, concise reply that directly answers the question.

    If the email contains any sensitive keywords like "${sensitiveKeywords.join(', ')}", respond with a message that invites the sender to meet in person. Format your reply in JSON structure, with these keys:
    
    Strictly ensure your output adheres to this JSON structure:
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
/**
 * Generates a response for an email sender using a context-aware chain of processes.
 *
 * This function utilizes a combination of language models, embeddings, and vector stores 
 * to generate a personalized response based on the provided sender information and 
 * pre-loaded user context.
 *
 * @async
 * @function responseGenerator
 * @param {string} senderName - The name of the email sender.
 * @param {string} senderEmail - The email content or subject received from the sender.
 * @returns {Promise<Object>} A JSON object containing the structured response with fields such as:
 * - **subject**: The email's subject line.
 * - **greeting**: Personalized greeting for the sender.
 * - **body**: The main response content.
 * - **signature**: The closing signature.
 *
 * @throws {Error} Throws an error if any of the following occurs:
 * - Context fails to load.
 * - Issues arise during document splitting, embedding, or vector store creation.
 * - Retrieval chain or output parsing fails.
 * @description
 * **Workflow:**
 * 1. **Load Context**: Retrieves the user's stored context using `loadContext`.
 * 2. **Document Splitting**: Splits the context into smaller chunks using `RecursiveCharacterTextSplitter`.
 * 3. **Embeddings and Vector Store**:
 *    - Converts the split chunks into embeddings using `OllamaEmbeddings`.
 *    - Stores these embeddings in a `MemoryVectorStore`.
 * 4. **Retriever and Chain Setup**:
 *    - Configures a retriever to fetch the most relevant chunks from the vector store.
 *    - Combines the retriever with a chain and output parser to generate responses.
 * 5. **Response Generation**:
 *    - Invokes the retrieval chain using sender information.
 *    - Parses the chain's output into a structured JSON format.
 */
const responseGenerator = async (senderName , senderEmail) => {
    const chain = await createStuffDocumentsChain({
        llm: model,
        prompt,
    });
    const user = 'irctcvivek62@gmail.com';
    const doc = await loadContext(user);
    console.log(doc);
    console.log(typeof(doc));

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 100000,
        chunkOverlap: 0
    });

    const splitDocs = (await splitter.splitText(doc)).map(content => new Document({ pageContent: content }));

    const embeddings = new OllamaEmbeddings({
        model: "llama3.2:1b",
        temperature: 0.5,
        // baseUrl: "http://192.168.65.3:30007"
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
/*
    This is the test code to run and test the model directly for input and getting the response.
*/
// (async () => {
//     const sender = "Nemo";
//     const input = "Good morning Sir, I want to meet you. Can you share your free time slot on Wednesday?";
//     const responseTest = await responseGenerator(sender, input);
//     console.log(responseTest);
// })();

module.exports = { responseGenerator }   