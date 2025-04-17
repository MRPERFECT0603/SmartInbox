const QuestionMap = {
  teacher: [
    {
      id: "teacherPersonality",
      label: "How would you describe your personality in one word?",
      type: "select",
      options: ["Supportive", "Analytical", "Passionate", "Calm", "Cheerful"],
    },
    {
      id: "teacherEmailRoutine",
      label: "Do you have a set routine for checking/responding to emails?",
      type: "select",
      options: ["Yes, specific times", "I check throughout the day", "No fixed routine"],
    },
    {
      id: "teacherStudentRelation",
      label: "What kind of relationship do you usually have with your students?",
      type: "select",
      options: ["Strict but fair", "Friendly mentor", "Professional", "Supportive guide"],
    },
    {
      id: "teacherColleagueTone",
      label: "How do you generally communicate with colleagues?",
      type: "select",
      options: ["Formal", "Collaborative", "Friendly", "Efficient"],
    },
    {
      id: "teacherTimeSensitivity",
      label: "How important is quick email response to you?",
      type: "select",
      options: ["Very important", "Nice to have", "Not very important"],
    },
  ],
  student: [
    {
      id: "studentPersonality",
      label: "Which of these best describes your communication personality?",
      type: "select",
      options: ["Curious", "Reserved", "Expressive", "Polite", "Pragmatic"],
    },
    {
      id: "studentEmailHabit",
      label: "How often do you check your emails?",
      type: "select",
      options: ["Multiple times a day", "Once a day", "Rarely unless expected"],
    },
    {
      id: "studentProfRelation",
      label: "How would you describe your relationship with professors?",
      type: "select",
      options: ["Formal", "Friendly", "Support-seeking", "Minimal"],
    },
    {
      id: "studentPeerInteraction",
      label: "What tone do you use when emailing fellow students?",
      type: "select",
      options: ["Casual", "Supportive", "Task-focused", "Friendly"],
    },
    {
      id: "studentStressEmail",
      label: "How do you handle emails under deadline stress?",
      type: "select",
      options: ["Brief and urgent", "Clear and to-the-point", "Still polite and structured"],
    },
  ],
  sales: [
    {
      id: "salesPersonality",
      label: "Which trait defines your approach in communication?",
      type: "select",
      options: ["Confident", "Empathetic", "Goal-driven", "Charming", "Persistent"],
    },
    {
      id: "salesEmailRhythm",
      label: "Do you follow a rhythm or schedule for prospecting emails?",
      type: "select",
      options: ["Yes, daily/weekly schedule", "Loosely follow one", "No fixed rhythm"],
    },
    {
      id: "salesClientBond",
      label: "How would you describe your typical client relationships?",
      type: "select",
      options: ["Transactional", "Trust-based", "Friendly", "Supportive"],
    },
    {
      id: "salesInternalComm",
      label: "How do you usually communicate with your team?",
      type: "select",
      options: ["Fast-paced updates", "Collaborative", "Detailed", "Casual chats"],
    },
    {
      id: "salesAdaptability",
      label: "Do you adapt your tone frequently based on the recipient?",
      type: "select",
      options: ["Always", "Sometimes", "Rarely"],
    },
  ],
  recruiter: [
    {
      id: "recruiterPersonality",
      label: "Which quality best describes you as a communicator?",
      type: "select",
      options: ["Empathetic", "Persuasive", "Upbeat", "Professional", "Friendly"],
    },
    {
      id: "recruiterFollowupHabit",
      label: "How persistent are you with follow-ups?",
      type: "select",
      options: ["Very persistent", "Reasonably", "Occasionally", "Rarely"],
    },
    {
      id: "recruiterCandidateBond",
      label: "How do you usually build rapport with candidates?",
      type: "select",
      options: ["Casual conversation", "Helpful tone", "Professional connection", "Mixed approach"],
    },
    {
      id: "recruiterInternalCollab",
      label: "How do you typically collaborate with hiring teams?",
      type: "select",
      options: ["Formal updates", "Ongoing discussions", "Quick syncs", "Depends on urgency"],
    },
    {
      id: "recruiterEmpathyUse",
      label: "Do you often tailor messages based on a candidate’s background?",
      type: "select",
      options: ["Always", "Sometimes", "Rarely"],
    },
  ],
  creator: [
    {
      id: "creatorPersonality",
      label: "How would you describe your personality in communication?",
      type: "select",
      options: ["Fun", "Authentic", "Inspiring", "Chill", "Direct"],
    },
    {
      id: "creatorInboxRoutine",
      label: "How do you usually handle your email inbox?",
      type: "select",
      options: ["Check once daily", "Check regularly", "Someone else helps", "Randomly check"],
    },
    {
      id: "creatorFanInteraction",
      label: "How do you typically respond to fans or community emails?",
      type: "select",
      options: ["With excitement", "Appreciatively", "Brief and sweet", "Depends on mood"],
    },
    {
      id: "creatorBrandTone",
      label: "How do you balance professionalism and personality in brand emails?",
      type: "select",
      options: ["Personality first", "Mostly professional", "Balanced tone", "Depends on brand"],
    },
    {
      id: "creatorEnergyUse",
      label: "Do you reflect your energy level in your writing?",
      type: "select",
      options: ["Always", "Sometimes", "Rarely"],
    },
  ],
  corporate: [
    {
      id: "corporatePersonality",
      label: "How would others describe your communication style?",
      type: "select",
      options: ["Assertive", "Clear", "Collaborative", "Thoughtful", "Strategic"],
    },
    {
      id: "corporateEmailRoutine",
      label: "How regularly do you check and respond to emails?",
      type: "select",
      options: ["Multiple times daily", "At set intervals", "Once or twice a day"],
    },
    {
      id: "corporateTeamDynamic",
      label: "How do you usually interact with your team via email?",
      type: "select",
      options: ["Brief updates", "Collaborative threads", "Structured reports", "Friendly notes"],
    },
    {
      id: "corporateLeadershipTone",
      label: "If you’re in a leadership role, what tone do you maintain?",
      type: "select",
      options: ["Motivational", "Firm and clear", "Approachable", "Results-oriented"],
    },
    {
      id: "corporateToneAdjustment",
      label: "Do you change tone depending on internal vs external recipients?",
      type: "select",
      options: ["Always", "Sometimes", "No, it's consistent"],
    },
  ],
};

export default QuestionMap;