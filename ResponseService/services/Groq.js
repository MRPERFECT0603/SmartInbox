const Groq = require('groq-sdk');
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { Document } = require("langchain/document");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { OllamaEmbeddings } = require("@langchain/ollama");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const Context = require("../Models/ContextModel");

const groq = new Groq({
  apiKey: "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"
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


// const fs = require('fs');
// const path = require('../../ResponseService');

// const loadContext = async () => {
//   try {
//     const filePath = path.join(__dirname, '../context.txt');
//     const context = fs.readFileSync(filePath, 'utf-8');

//     if (!context || typeof context !== 'string') {
//       throw new Error('Context is empty or invalid');
//     }

//     console.log("✅ Context Loaded from context.txt");
//     return context;
//   } catch (error) {
//     console.error('❌ Error loading context from file:', error.message);
//     throw error;
//   }
// };

const responseGenerator = async (senderName, emailText) => {
  const user = 'irctcvivek62@gmail.com';
  const rawContext = await loadContext(user);
  //   const rawContext = `	1.	Personal Information
	// 	 	Name: Vivek Shaurya
	// 	 	Age: 21
	// 	 	Occupation: Teacher specializing in Computer Science
	// 	 	Personality: Described as a “Sigma Male”
	// 2.	Contact Information
	// 	 	Email: vivekshaurya62@gmail.com
	// 	 	School Phone: (123) 456-7890
	// 	 	School Website: www.jiit.ac.in
	// 3. Course Taught: “Introduction to Web Technology” (CSE1803C22), “Data Structures and Algorithms” (CSE1502D21), “Operating Systems” (CSE2104B23), “Database Management Systems” (CSE2205C24), “Introduction to Artificial Intelligence” (CSE2401A25), “Computer Networks” (CSE2606B26)
	// 	 	Duration: One semester (15 weeks)
	// 	 	Schedule:
	// 	 	Introduction to Web Technology: Mondays and Wednesdays, 10:00 AM - 11:30 AM, Room G9
	// 	 	Data Structures and Algorithms: Tuesdays and Thursdays, 9:00 AM - 10:00 AM, Room B12
	// 	 	Operating Systems: Tuesdays, 11:00 AM - 12:00 PM; Thursdays, 9:00 AM - 10:00 AM, Room C5
	// 	 	Database Management Systems: Thursdays, 1:00 PM - 3:00 PM (Lab), Room D3
	// 	 	Introduction to Artificial Intelligence: Fridays, 11:30 AM - 12:30 PM, Room E1
	// 	 	Computer Networks: Mondays, 9:00 AM - 10:00 AM; Fridays, 10:00 AM - 11:00 AM, Room F2
	// 	 	Objectives:
	// 	 	Introduction to Web Technology: This course introduces fundamental concepts and technologies for web development. It covers the structure, presentation, and behavior of web pages, providing a foundation in both client-side and server-side development.
	// 	 	Data Structures and Algorithms: This course provides an in-depth understanding of data structures and algorithms, covering topics such as arrays, stacks, queues, linked lists, trees, graphs, and sorting algorithms, emphasizing problem-solving and algorithmic thinking.
	// 	 	Operating Systems: This course explores the fundamental concepts of operating systems, including process management, memory management, file systems, and I/O operations. It provides a comprehensive overview of how operating systems work and their role in managing computer hardware and software resources.
	// 	 	Database Management Systems: This course covers the principles of database systems, focusing on database design, SQL, and relational databases. It includes practical lab sessions where students gain hands-on experience in creating and managing databases, emphasizing data integrity and security.
	// 	 	Introduction to Artificial Intelligence: This course introduces the fundamental concepts of artificial intelligence, including search algorithms, knowledge representation, machine learning, and problem-solving techniques. It provides an overview of AI applications and ethical considerations in the field.
	// 	 	Computer Networks: This course covers the essentials of computer networks, including network models, protocols, IP addressing, and network security. It aims to provide students with a foundational understanding of how networks operate and communicate in different environments.
	// 4.	Class Policies
	// 	 	Attendance: Regular attendance is required. Inform Vivek if unable to attend.
	// 	 	Late Assignments: 10% penalty per day unless prior arrangements are made.
	// 5.	Frequently Asked Questions (FAQs)
	// 	 	Contact: Best reached via email or school messaging platform
	// 	 	Class Materials: Available on the school’s LMS under “Course Materials”
	// 	 	Missed Classes: Check LMS for notes and recorded lectures or ask a classmate
	// 6.	Important Dates
	// 	 	Midterm Exam: March 15, 2024
	// 	 	Final Exam: May 10, 2024
	// 	 	Project Deadline: April 20, 2024
	// 7.	Grading Breakdown
	// 	 	Assignments: 25%
	// 	 	Midterm Exam: 20%
	// 	 	Midterm Exam: 20%
	// 	 	Final Exam: 35%
	// 8.	Available Resources
	// 	 	Office Hours: Monday to Friday, From 9AM to 5PM
	// 	 	Recommended Textbooks: “WEB-TECH Mastery” by Vivek & NEMO
	// 	 	Online Resources: NEMO CLASSES, JUSTYOUTUBE
	// 9.	Classroom Guidelines
	// 	 	Respect and Inclusion: All opinions should be respected.
	// 	 	Participation: Actively encouraged and counts toward the overall grade
	// 	 	Electronics: Should be silenced and stored away during class
	// 10.	Weekly Timetable For Lectures (Daily Available Hours 9AM to 5PM, except the Lecture Hours)
	// 		Lecture Hours:
	// 	 	Monday: [Data Structures, 9:00 AM - 10:00 AM, Room G1] , [Web Development Lab, 10:30 AM - 12:30 PM, Room FF4]
	// 	 	Tuesday: [Operating Systems, 9:00 AM - 10:00 AM, Room FF4], [Introduction to AI, 11:00 AM - 12:00 PM, Room G1]
	// 	 	Wednesday: [Computer Networks, 10:00 AM - 11:00 AM, Room FF9], [Data Structures, 11:30 AM - 12:30 PM, Room LT2]
	// 	 	Thursday: [Operating Systems, 9:00 AM - 10:00 AM, Room G1], [Database Management Lab, 1:00 PM - 3:00 PM, Room LT2]
	// 	 	Friday: [Computer Networks, 10:00 AM - 11:00 AM, Room LT2], [Introduction to AI, 11:30 AM - 12:30 PM, Room FF4]
	// `;

  // Split context into documents
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 100000,
    chunkOverlap: 0,
  });

  const splitDocs = (await splitter.splitText(rawContext)).map(
    content => new Document({ pageContent: content })
  );

  // Local Ollama for embeddings
  const embeddings = new OllamaEmbeddings({
    model: "llama3.2:1b",
    temperature: 0.5,
    baseUrl: "http://localhost:11434"
  });

  const vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, embeddings);
  const retriever = vectorStore.asRetriever({ k: 1 });

  const retrievedDocs = await retriever.getRelevantDocuments(emailText);
  const contextChunk = retrievedDocs.map(doc => doc.pageContent).join("\n\n");

  // Construct prompt
  const promptText = `
You are an email assistant named "Otter", responding on behalf of Vivek. Use the provided context to respond in a single, concise reply that directly answers the question.

If the email contains any sensitive keywords like "${sensitiveKeywords.join(', ')}", respond with a message that invites the sender to meet in person.

Strictly format your response in this JSON structure:
{
  "subject": "A concise, relevant subject line tailored to the received email.",
  "greeting": "Dear ${senderName}",
  "body": "The main response content that addresses the sender's question",
  "signature": "Best regards, Vivek Shaurya"
}

Context:
${contextChunk}

Email received:
${emailText}

Respond as Vivek:
`;

  // Final response from Groq
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
    console.error("❌ Error parsing JSON from Groq:", content);
    throw e;
  }

  return finalAnswer;
};

// ────────────────────────────
// 🧪 Test Runner (Remove in prod)
(async () => {
  const sender = "Nemo";
  const input = "I am in trouble, Please Help me!!  ";
  const response = await responseGenerator(sender, input);
  console.log("🟢 Final Answer:\n", response);
})();



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