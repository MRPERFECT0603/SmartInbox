const { VertexAI } = require('@google-cloud/vertexai');
const { credentials } = require('../email-analyzer-427913-33556e9d8c2e.json');
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
        let messagelabel;
        if(label.includes("Interested")) messagelabel = "Interested";
        if(label.includes("Not interested")) messagelabel = "Not Interested";
        if(label.includes("More Information")) messagelabel = "More Information";
        console.log(`Label: ${messagelabel}`);
        return messagelabel;
    } catch (error) {
        console.error('Error generating content:', error);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response headers:', JSON.stringify(error.response.headers));
            console.error('Response body:', await error.response.text());
        }
    }
}


const Analyzer = (req, res) => {
    const { messageData } = req.body;
    generate_from_text_input(projectId, messageData).then(
        (label) => {
            res.status(200).send({ label });
        }
    )

}


module.exports = { Analyzer }