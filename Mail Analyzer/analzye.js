const { VertexAI } = require('@google-cloud/vertexai');
const { credentials } = require('./email-analyzer-427913-33556e9d8c2e.json');
const emailContent = `Subject: Inquiry About Pricing Plans and Features

Dear Ms. Smith,

I hope this message finds you well. I recently came across your product/service TechSolutions and I'm quite impressed with what I've seen so far. Before making a decision, I'd like to gather more information about your pricing plans and the specific features included.

Could you please provide details on:

1. Pricing tiers and any associated costs.
2. Key features and functionalities offered.
3. Any customization options available.

Additionally, if you have any case studies or testimonials that demonstrate successful use cases, I would greatly appreciate it if you could share those as well.

Looking forward to hearing from you soon!

Best regards,
John Doe
john.doe@example.com
123-456-7890`;
const projectId = 'email-analyzer-427913'
async function generate_from_text_input(projectId, emailContent) {
    const vertexAI = new VertexAI({
        project: projectId,
        location: 'us-central1',
        credentials: credentials
    });

    const generativeModel = vertexAI.getGenerativeModel({
        model: 'gemini-1.5-flash-001',
    });

    const prompt =
        `Categorize the following email into one of the three labels: Interested, Not Interested, or More information.\n\n${emailContent}\n\nLabel: `;

    try {
        const resp = await generativeModel.generateContent(prompt);
        console.log(`Response: ${JSON.stringify(resp.response)}`);
        const label = resp.response.candidates[0].content.parts[0].text.trim().replace('Label: ', '').replace(/\*/g, '');;
        console.log(`Label: ${label}`);
    } catch (error) {
        console.error('Error generating content:', error);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response headers:', JSON.stringify(error.response.headers));
            console.error('Response body:', await error.response.text());
        }
    }
}



generate_from_text_input(projectId, emailContent);