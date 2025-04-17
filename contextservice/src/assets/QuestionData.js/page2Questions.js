const QuestionMap = {
  teacher: [
    {
      id: "teacherEmailFormality",
      label: "How formal or informal do you prefer your emails to be?",
      type: "select",
      options: ["Very Formal", "Slightly Formal", "Neutral", "Friendly"],
    },
    {
      id: "teacherGreetingStyle",
      label: "How do you usually greet your students or colleagues in emails?",
      type: "input",
      placeholder: "e.g., Dear Students, Hi Team, Hello Everyone",
    },
    {
      id: "teacherResponseDetail",
      label: "How detailed are your typical email responses?",
      type: "select",
      options: [
        "Concise and direct",
        "Include background and explanation",
        "Depends on topic",
      ],
    },
    {
      id: "teacherStructurePreference",
      label: "Do you prefer using structured lists or paragraphs while replying?",
      type: "select",
      options: ["Bullet points", "Paragraphs", "Mix of both"],
    },
    {
      id: "teacherSignOff",
      label: "Any specific sign-off you always use?",
      type: "input",
      placeholder: "e.g., Best Regards, Sincerely, Warm wishes",
    },
  ],
  student: [
    {
      id: "studentTone",
      label: "What tone do you usually maintain while emailing professors or classmates?",
      type: "select",
      options: ["Respectful", "Friendly", "Casual"],
    },
    {
      id: "studentHelpComfort",
      label: "How comfortable are you expressing uncertainty or asking for help in emails?",
      type: "select",
      options: ["Very comfortable", "Somewhat", "Not really"],
    },
    {
      id: "studentEmailLength",
      label: "Do you prefer short emails or more detailed ones when explaining something?",
      type: "select",
      options: ["Short", "Detailed", "Depends on situation"],
    },
    {
      id: "studentGreeting",
      label: "Do you greet people formally or informally?",
      type: "input",
      placeholder: "e.g., Dear Sir/Ma’am or Hey!",
    },
    {
      id: "studentIdealReply",
      label: "What kind of email response feels 'just right' to you?",
      type: "select",
      options: ["To the point", "Encouraging", "Detailed"],
    },
  ],
  corporate: [
    {
      id: "corporateTone",
      label: "What is your preferred tone in business emails?",
      type: "select",
      options: [
        "Formal",
        "Professional yet friendly",
        "Direct",
        "Conversational",
      ],
    },
    {
      id: "corporateBrevity",
      label: "How important is brevity in your communication?",
      type: "select",
      options: ["Extremely important", "Moderately", "Not a concern"],
    },
    {
      id: "corporateIntroStyle",
      label: "Do you prefer emails that get straight to the point or build context first?",
      type: "select",
      options: ["Straight to the point", "Build context first"],
    },
    {
      id: "corporateCTA",
      label: "Do you usually write with a call-to-action or leave it open-ended?",
      type: "select",
      options: ["Call-to-action", "Open-ended"],
    },
    {
      id: "corporateFormat",
      label: "Do you typically use structured formatting in your emails?",
      type: "select",
      options: ["Yes, always", "Sometimes", "No, rarely"],
    },
  ],
  sales: [
    {
      id: "salesPersuasion",
      label: "How persuasive or assertive do you prefer your emails to sound?",
      type: "select",
      options: ["Strongly persuasive", "Subtle influence", "Neutral"],
    },
    {
      id: "salesUrgency",
      label: "Do you often use urgency or FOMO in your messaging?",
      type: "select",
      options: ["Yes", "Occasionally", "Rarely"],
    },
    {
      id: "salesGreeting",
      label: "What is your preferred greeting for prospects or clients?",
      type: "input",
      placeholder: "e.g., Hey [Name], Hope you’re doing well",
    },
    {
      id: "salesClosing",
      label: "Do you usually end with a strong CTA or a gentle suggestion?",
      type: "select",
      options: ["Strong CTA", "Gentle suggestion"],
    },
    {
      id: "salesFollowupTone",
      label: "How do you handle follow-ups — casual or persistent tone?",
      type: "select",
      options: ["Casual", "Persistent", "Balanced"],
    },
  ],
  recruiter: [
    {
      id: "recruiterTone",
      label: "What’s your go-to tone when contacting candidates?",
      type: "select",
      options: [
        "Warm and professional",
        "Friendly and energetic",
        "Formal and respectful",
      ],
    },
    {
      id: "recruiterTemplates",
      label: "Do you prefer using templates or writing unique messages?",
      type: "select",
      options: ["Templates", "Unique messages", "Mix of both"],
    },
    {
      id: "recruiterIntroStyle",
      label: "How do you usually start an outreach email?",
      type: "select",
      options: [
        "With praise",
        "Opportunity pitch",
        "Direct intro",
        "Depends on candidate",
      ],
    },
    {
      id: "recruiterInternalTone",
      label: "What level of formality do you maintain when emailing internally?",
      type: "select",
      options: ["Formal", "Friendly", "Neutral"],
    },
    {
      id: "recruiterCulturePitch",
      label: "Do you prefer brief intros or sharing company culture upfront?",
      type: "select",
      options: ["Brief intros", "Share company culture", "Depends on role"],
    },
  ],
  creator: [
    {
      id: "creatorVoice",
      label: "What tone reflects your personality best?",
      type: "select",
      options: ["Casual", "Witty", "Inspiring", "Energetic"],
    },
    {
      id: "creatorOpeningLine",
      label: "How do you like to start emails with brands or fans?",
      type: "input",
      placeholder: "e.g., Hope you're doing well, Hey there, Yo fam!",
    },
    {
      id: "creatorHumanVsPR",
      label:
        "Do you prefer voice that’s more real/human or polished/PR-like in messages?",
      type: "select",
      options: ["Real/Human", "Polished/PR-like", "Mix of both"],
    },
    {
      id: "creatorSignOff",
      label: "How do you usually close your emails?",
      type: "input",
      placeholder: "e.g., Stay awesome, Cheers, Talk soon!",
    },
    {
      id: "creatorEmojis",
      label: "Do you often use emojis, exclamations, or links in your messages?",
      type: "select",
      options: ["Yes", "Sometimes", "Rarely"],
    },
  ],
};

export default QuestionMap;