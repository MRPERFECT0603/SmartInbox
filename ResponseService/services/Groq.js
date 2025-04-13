const Groq = require('groq-sdk');
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { Document } = require("langchain/document");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { OllamaEmbeddings } = require("@langchain/ollama");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const Context = require("../Models/ContextModel");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const sensitiveKeywords = [
  "bullying", "ragging", "need help", "problems", "struggling", "harassment",
  "abuse", "threats", "isolation", "neglect", "anxiety", "depression",
  "crisis", "trauma", "conflict", "discrimination", "emotional distress",
  "suicidal thoughts", "peer pressure", "overwhelmed", "burnout",
  "mental health issues", "substance abuse", "exclusion", "violence"
];

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

    console.log("✅ Context Loaded from MongoDB.");
    return context;
  } catch (error) {
    console.error('❌ Error loading context:', error);
    throw error;
  }
};

const loadEmailHistory = async (userEmail) => {
  try {
    const contextDoc = await Context.findOne({ email: userEmail });

    if (!contextDoc) {
      throw new Error('Context not found for this sender email');
    }

    const emailHistoryArray = contextDoc.previousEmail;

    if (!Array.isArray(emailHistoryArray)) {
      throw new Error('Previous email history is not a valid array');
    }

    const fullEmailHistory = emailHistoryArray.join('\n\n'); 

    console.log("Email History Loaded from MongoDB.");
    return fullEmailHistory;
  } catch (error) {
    console.error('Error loading email history:', error);
    throw error;
  }
};

const responseGenerator = async (userEmail, senderName,  senderEmail , emailContent) => {
  // console.log("ResponseGenerator" + userEmail + senderEmail + senderName + emailContent);
  const rawContext = await loadContext(userEmail);
  const rawEmailHistory = await loadEmailHistory(userEmail);

  // Split context into documents for vector embeddings
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 100000,
    chunkOverlap: 0,
  });

  const splitDocs = (await splitter.splitText(rawContext)).map(
    content => new Document({ pageContent: content })
  );

  const embeddings = new OllamaEmbeddings({
    model: "llama3.2:1b",
    temperature: 0.5,
    baseUrl: "http://localhost:11434",
  });

  const vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, embeddings);
  const retriever = vectorStore.asRetriever({ k: 1 });

  const retrievedDocs = await retriever.getRelevantDocuments(emailContent);
  const contextChunk = retrievedDocs.map(doc => doc.pageContent).join("\n\n");

  const combinedContext = `
    User context info: ${contextChunk}

    Recent email history: ${rawEmailHistory}
  `;

const promptText = `
    You are an intelligent email assistant named "Otter", replying on behalf of ${userEmail}.
    Use both the **User Context** and the **Email History** to generate a thoughtful and consistent response.
---

###  CONTEXTUAL RULES

1. **Strict Thread Isolation:** Only use context from the current thread with **${senderName}**. 
   - Do **NOT** reference discussions, decisions, or meetings from other senders or unrelated threads.
   - If you're unsure whether something was mentioned in this thread, **assume it wasn't**.

2. **Email History First:** Always read the **entire conversation history** with ${senderName} before responding. Identify:
   - Pending requests
   - Commitments or confirmations
   - Proposed times or topics

3. **Maintain Conversational Flow:**
   - Match tone and formality from previous replies.
   - If a prior question was ignored, politely acknowledge and address it.
   - If the sender is following up, reflect that awareness ("Thanks for the reminder", etc.).

---

###  PRIVACY & DATA HANDLING

4. **Zero Leakage Policy:** 
   - Do **NOT** share or imply any personal details (e.g., full name, calendar, contacts, files, phone numbers, locations).
   - Do **NOT** mention or forward information from other users, even indirectly.

5. **No Hallucinations:**
   - Do not guess, assume, or fabricate any facts.
   - If information is missing or unclear, respond with:
     > “I’ll follow up on that and get back to you.”
     or
     > “Let me confirm that for you and respond shortly.”

6. **Sensitive Topics Handling:**
   - If the email contains any sensitive keywords like "${sensitiveKeywords.join(', ')}", **avoid digital discussion**.
   - Respond with:
     > “Given the nature of this topic, I suggest we discuss this in person or via a secure channel.”

---

###  SCHEDULING & MEETINGS

7. **No Double-Booking:**
   - Before confirming any meeting time, scan the thread and history for conflicts.
   - If a time has already been committed, suggest an alternative.

8. **Be Time-Zone Aware:**
   - If time zones are mentioned, reflect them accurately.
   - If uncertain, confirm the sender's time zone instead of assuming.

---

###  WRITING STYLE & TONE

9. **Be Clear, Concise, and Polite:**
   - Do not over-explain. Stay on point.
   - Use simple, professional language.
   - Use contractions sparingly depending on tone.

10. **Defer when Needed:**
    - It’s okay to not know. It’s **not** okay to mislead.
    - Show ownership: “I'll check with Vivek and follow up soon.”

---
    Your response must be valid JSON in the following format:
    {
      "subject": "A short, relevant subject for this email.",
      "greeting": "Dear ${senderName},",
      "body": "Main reply that addresses the question or request.",
      "signature": "Best regards,\\nOtter"
    }

    ---

    ### ABSOLUTE NO-GOs
    
    - Never invent meeting times or decisions.
    - Never forward, leak, or imply information about unrelated people or emails.
    - Never mention “I’m an AI” or refer to yourself as a bot or model.
    - Never speculate or make up responses.
    
    ---

    User Context and History:
    ${combinedContext}

    New Incoming Email:
    ${emailContent}

    Now write a response as Vivek:
`;

  // 🧠 Call Groq to generate response
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: promptText,
      },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    max_tokens: 1024,
    top_p: 1,
  });

  const content = chatCompletion.choices[0]?.message?.content || "{}";

  let finalAnswer;
  try {
    finalAnswer = JSON.parse(content);
  } catch (e) {
    console.error("❌ Failed to parse JSON:", content);
    throw e;
  }

  return finalAnswer;
};

// ────────────────────────────
// 🧪 Test Runner (Remove in prod)
// (async () => {
//   const sender = "Nemo";
//   const input = "I am in trouble, Please Help me!!  ";
//   const response = await responseGenerator(sender, input);
//   console.log("🟢 Final Answer:\n", response);
// })();



module.exports = { responseGenerator }   


// async function main() {
//   const chatCompletion = await groq.chat.completions.create({
//     messages: [
//       {
//         role: "user",
//         content: "Hey"
//       }
//     ],
//     model: "llama-3.3-70b-versatile",
//     temperature: 1,
//     max_tokens: 1024, 
//     top_p: 1,
//     stream: true
//   });

//   for await (const chunk of chatCompletion) {
//     process.stdout.write(chunk.choices[0]?.delta?.content || '');
//   }
// }

// main();