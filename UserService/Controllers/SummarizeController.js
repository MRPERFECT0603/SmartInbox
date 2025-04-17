const Groq = require('groq-sdk');
const Context = require("../Models/ContextModel");
const Summary = require("../Models/SummaryModel");


const fetchsummarizeConversations = async (req, res) => {
  const { email } = req.params;

  try {
    if (!email) {
      return res.status(400).json({ error: "Email is required in params." });
    }

    const summaries = await Summary.find({ userEmail: email }).sort({ updatedAt: -1 });

    if (!summaries || summaries.length === 0) {
      return res.status(404).json({ message: "No summaries found for this email." });
    }

    const latestSummaries = summaries.slice(0, 5);

    const formattedSummaries = latestSummaries.map(summary => ({
      id: summary._id,
      email: summary.email,
      sender: summary.name,
      summary: summary.summary,
      totalMails: summary.totalMails,
      createdAt: summary.createdAt,
      updatedAt: summary.updatedAt
    }));

    res.status(200).json({ summaries: formattedSummaries });
  } catch (error) {
    console.error("Error fetching summaries:", error);
    res.status(500).json({ error: "Failed to fetch summarized conversations." });
  }
};

const saveSummary = async (summaryArray, userEmail) => {
  try {
    const summariesToSave = [];

    // Collect all summaries to save
    for (const user of summaryArray) {
      const { sender, summary, totalMails } = user;
      console.log(sender, summary, totalMails);

      if (!sender || sender === "undefined") continue;

      const name = sender.split('@')[0]; // Extract the name from the email

      // Create a new summary document
      const newSummary = {
        userEmail, // Same user email for all summaries
        name, // Sender's name
        email: sender, // Sender's email
        totalMails, // Number of emails in the conversation
        summary, // The summary of the conversation
      };

      summariesToSave.push(newSummary); // Add to the list of summaries to save
    }

    // Insert all summaries at once using insertMany to create separate documents
    if (summariesToSave.length > 0) {
      await Summary.insertMany(summariesToSave);
      console.log("Summaries saved to MongoDB.");
    }

  } catch (error) {
    console.error("Error saving summaries:", error);
  }
};

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const summarizeConversations = async (req, res) => {
  const { email } = req.params;

  try {
    const contextDoc = await Context.findOne({ email });

    if (!contextDoc || !Array.isArray(contextDoc.previousEmail)) {
      throw new Error("Previous emails not found or invalid.");
    }

    console.log(contextDoc);

    const previousEmailArray = contextDoc.previousEmail;
    const grouped = {};

    previousEmailArray.forEach(entry => {
      // Extract parts using regex
      const fromMatch = entry.match(/From:\s*(.*?)\s*\|/);
      const messageMatch = entry.match(/Message:\s*(.*?)\s*\|/s);
      const responseMatch = entry.match(/Response:\s*(\{.*\})/s);
  
      if (fromMatch && messageMatch && responseMatch) {
        const sender = fromMatch[1].trim();
        const message = messageMatch[1].trim();
        let response;
  
        try {
          response = JSON.parse(responseMatch[1].trim());
        } catch (err) {
          console.error("Invalid JSON in response:", responseMatch[1]);
          response = {};
        }
  
        if (!grouped[sender]) {
          grouped[sender] = [];
        }
  
        grouped[sender].push({
          message,
          response: JSON.stringify(response)
        });
      }
    });

    console.log(grouped);

    let multiThreadPrompt = `You are a summarization assistant.

Below are multiple conversations between external senders and the assistant (you). Each conversation consists of the sender's message and the assistant's response.

For each sender, summarize the overall conversation (based on both the messages and the responses) in 2–3 lines.

Return the result in JSON format as an array with the following fields: 
- sender: name of the person
- totalMails: total number of message-response pairs
- summary: a brief overview of the interaction

**IMPORTANT**: This is NOT a conversation between two people. It is between one sender and YOU, the assistant, so Summarize in first person.


**If no conversation exists, just return:** []

`;


    multiThreadPrompt += JSON.stringify(grouped);

    console.log(multiThreadPrompt);

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: multiThreadPrompt
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 800,
    });

    const rawContent = chatCompletion.choices[0]?.message?.content?.trim();

    let summaryResponse;
    let parsedArray;

    try {
      summaryResponse = JSON.parse(rawContent);
      parsedArray = Array.isArray(summaryResponse)
        ? summaryResponse
        : [summaryResponse]; // Handle single object too
    } catch (err) {
      const clean = rawContent.replace(/```json|```/g, '').trim();
      try {
        summaryResponse = JSON.parse(clean);
        parsedArray = Array.isArray(summaryResponse)
          ? summaryResponse
          : [summaryResponse];
      } catch (err2) {
        console.error("Could not parse response as JSON array.");
        console.log("🪵 Raw content from LLM:", rawContent); // helpful debug
        return res.status(500).json({ error: "Failed to parse summary response." });
      }
    }

    await saveSummary(parsedArray , email);
    return res.status(200).json({ summary: parsedArray });

  } catch (err) {
    console.error("Error summarizing conversation:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { summarizeConversations , fetchsummarizeConversations};