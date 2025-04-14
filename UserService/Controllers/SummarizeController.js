const Groq = require('groq-sdk');
const Context = require("../Models/ContextModel");
const Summary = require("../Models/SummaryModel");

const saveSummary = async (summaryArray , userEmail) => {
  try {
    for (const user of summaryArray) {
      const { sender, summary, totalMails } = user;
      console.log(sender , summary , totalMails);

      if (!sender || sender === "undefined") continue;

      const name = sender.split('@')[0];

      await Summary.findOneAndUpdate(
        { userEmail: userEmail },
        {
          userEmail,
          name,
          email: sender,
          totalMails,
          summary
        },
        { upsert: true, new: true }
      );
    }

    console.log("Summaries saved to MongoDB.");
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
        console.error("❌ Vivek  ... Could not parse response as JSON array.");
        console.log("🪵 Raw content from LLM:", rawContent); // helpful debug
        return res.status(500).json({ error: "Failed to parse summary response." });
      }
    }

    await saveSummary(parsedArray , email);
    return res.status(200).json({ summary: parsedArray });

  } catch (err) {
    console.error("❌ Error summarizing conversation:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { summarizeConversations };