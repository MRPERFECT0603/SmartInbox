const { VertexAI } = require('@google-cloud/vertexai');
const { credentials } = require('./email-analyzer-427913-33556e9d8c2e.json');
const emailContent = `Elearnmarkets Welcome Email Did You Know??
                                     The Infosys Technologies IPO was undersubscribed
                                     In June 1993, Infosys launched its IPO with shares priced at Rs 95 each. It
                                        didn't attract enough buyers initially, so Morgan Stanley stepped in and bought
                                        13% of the shares. 
                                     When the stock listed, it was priced at Rs 145, giving a gain of over 52%. If
                                        you had invested Rs 9,500 in the IPO, it would now be worth over Rs 2 crore,
                                        plus you would have earned nearly Rs 20 lakh in dividends.
                                     Suzlon- The Pioneer Of Wind Energy
                                     Suzlon, a leading Indian wind turbine manufacturer, was the pioneer in bringing
                                        wind energy to India in 1995.  They installed the country's first-ever commercial wind turbine!
                                     Some Big News This Week!
                                     SEBI suspects front-running at  Quant Mutual
                                            Fund , with executives possibly
                                        leaking trade details. Raids on Quant's offices led to the seizure of digital
                                        devices to uncover these leaks.
                                     Stressed investors of Quant Mutual Fund have withdrawn around Rs 1,400 crore in
                                        just 3 days due to Sebi's investigation into a front-running case. Many
                                        investors in its schemes are now concerned about whether they should start new
                                        investments, continue their SIPs, or stop them altogether.
                                     The NAV of the Quant Small Cap Fund fell by 0.66%, even though their benchmarks
                                        increased by 0.0091%. Similarly, the NAV of the Quant Mid Cap Fund decreased by
                                        0.94%, while their benchmarks rose by 0.24%.
                                     What is NAV in Mutual Funds and Why It Matters ?
                                     READ THE FULL BLOG
                                     Let's Learn !
                                     What Is An FPO?
                                     FPO stands for Follow on Public Offer, is a process by which the company already
                                        listed on the stock exchange issues shares to the existing shareholders of the
                                        company or to new investors.
                                     The price is set through underwriting, considering market conditions, valuation,
                                        and negotiations. FPO share pricing depends on investor demand, the company's
                                        financial performance, and market conditions.
                                     A recent example can be Vodafone Idea's Follow-on Public Offer (FPO) was open
                                        for bidding from April 18 to April 22. The shares were offered at a fixed price
                                        range of Rs 10-11 per share.
                                     Learn More
                                     Upcoming Webinar
                                     How Options Trading Can Supercharge Your ROI
                                     In this webinar, you will learn how to choose the right strike price. You'll
                                        also discover how to time your entry and exit from trades using the Gann number,
                                        OI Crossovers, and MACD strategy. Additionally, you'll learn how to trade in the
                                        cash market using Margin Trading Facility (MTF).
                                     GET MORE DETAILS
                                     Weekly Market Update For You
                                     Nifty around 24000 !
                                     This week, the Nifty 50 is up by 2% and closed near 24,000. The most important
                                        support is 23,500.
                                     The Bank Nifty rose 1.4% this week and closed around 52,400. The next resistance
                                        zone for the Bank Nifty is around 53,000
                                     The India Vix rose 4.8% to the level of 13
                                     That's all for now. Stay Tuned to Stay Updated… Keep Learning!
                                     Follow us on :  Copyright &copy; 2024 Elearnmarkets. All rights reserved. Need help with learning
                finance? Call us at  +91-9748222555 If you no longer wish to
                receive email notifications from
                Elearnmarkets, Click to  Unsubscribe`;
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