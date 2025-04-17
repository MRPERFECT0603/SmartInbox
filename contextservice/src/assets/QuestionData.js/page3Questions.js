const QuestionMap = {
  teacher: [
    {
      id: "teacherWorkMode",
      label: "Do you primarily teach online, in-person, or hybrid?",
      type: "select",
      options: ["Online", "In-person", "Hybrid"],
    },
    {
      id: "teacherAudience",
      label: "Who do you usually communicate with through emails?",
      type: "select",
      options: ["Students", "Parents", "Faculty", "Admins", "All of the above"],
    },
    {
      id: "teacherSubjects",
      label: "What subjects or grade levels do you typically handle?",
      type: "input",
      placeholder: "e.g., Grade 10 Math, College Physics, Primary School",
    },
    {
      id: "teacherSchedule",
      label: "What does your typical daily schedule look like?",
      type: "input",
      placeholder: "e.g., Mornings for classes, Afternoons for planning, etc.",
    },
    {
      id: "teacherUrgency",
      label: "Do you often deal with urgent or last-minute communication?",
      type: "select",
      options: ["Frequently", "Occasionally", "Rarely"],
    },
  ],
  student: [
    {
      id: "studentMode",
      label: "Are you currently studying full-time, part-time, or remotely?",
      type: "select",
      options: ["Full-time", "Part-time", "Remote/Online"],
    },
    {
      id: "studentRecipients",
      label: "Who do you typically email for academic purposes?",
      type: "select",
      options: ["Professors", "Classmates", "Admin staff", "TA/Assistants"],
    },
    {
      id: "studentCourses",
      label: "What subjects or majors are you currently pursuing?",
      type: "input",
      placeholder: "e.g., Computer Science, Psychology, Engineering",
    },
    {
      id: "studentEmailTiming",
      label: "When do you usually find yourself writing emails?",
      type: "select",
      options: ["During assignments", "When confused", "Just before deadlines"],
    },
    {
      id: "studentEmailVolume",
      label: "How many academic or professional emails do you send in a week?",
      type: "select",
      options: ["1–2", "3–5", "6–10", "More than 10"],
    },
  ],
  corporate: [
    {
      id: "corporateRole",
      label: "What’s your current job title or department?",
      type: "input",
      placeholder: "e.g., Product Manager, Marketing Lead, Software Engineer",
    },
    {
      id: "corporateTeamSize",
      label: "How large is your immediate team or project group?",
      type: "select",
      options: ["1–5", "6–15", "15–30", "30+"],
    },
    {
      id: "corporateCommunication",
      label: "Who do you mostly email at work?",
      type: "select",
      options: ["Clients", "Team members", "Leadership", "Cross-functional teams"],
    },
    {
      id: "corporateWorkStyle",
      label: "Is your team mostly remote, hybrid, or on-site?",
      type: "select",
      options: ["Remote", "Hybrid", "On-site"],
    },
    {
      id: "corporateDailyEmails",
      label: "How many work-related emails do you typically handle daily?",
      type: "select",
      options: ["0–5", "6–15", "15–30", "30+"],
    },
  ],
  sales: [
    {
      id: "salesIndustry",
      label: "What industry or sector do you primarily sell to?",
      type: "input",
      placeholder: "e.g., SaaS, Real Estate, B2B Healthcare",
    },
    {
      id: "salesOutboundVolume",
      label: "How many outreach emails do you typically send daily?",
      type: "select",
      options: ["0–5", "5–10", "10–20", "20+"],
    },
    {
      id: "salesCycle",
      label: "What’s the typical length of your sales cycle?",
      type: "select",
      options: ["Short (1–2 weeks)", "Medium (1–2 months)", "Long (3+ months)"],
    },
    {
      id: "salesLeadType",
      label: "Do you work mostly with cold leads, warm leads, or existing clients?",
      type: "select",
      options: ["Cold leads", "Warm leads", "Existing clients", "Mix of all"],
    },
    {
      id: "salesFollowUpFrequency",
      label: "How often do you follow up with prospects via email?",
      type: "select",
      options: ["Every few days", "Weekly", "Bi-weekly", "Rarely"],
    },
  ],
  recruiter: [
    {
      id: "recruiterDomain",
      label: "Which domain or industry do you usually hire for?",
      type: "input",
      placeholder: "e.g., Tech, Finance, Design, Healthcare",
    },
    {
      id: "recruiterVolume",
      label: "How many candidate emails/outreach messages do you send daily?",
      type: "select",
      options: ["0–5", "5–10", "10–20", "20+"],
    },
    {
      id: "recruiterHiringStage",
      label: "At what stage do you mostly communicate — sourcing, interviewing, or offer stage?",
      type: "select",
      options: ["Sourcing", "Interview coordination", "Offer negotiation", "All stages"],
    },
    {
      id: "recruiterCollab",
      label: "Who else do you collaborate with over email?",
      type: "select",
      options: ["Hiring Managers", "HR", "Candidates", "All of them"],
    },
    {
      id: "recruiterTimezone",
      label: "Do you often coordinate across time zones?",
      type: "select",
      options: ["Yes", "Sometimes", "No"],
    },
  ],
  creator: [
    {
      id: "creatorPlatform",
      label: "What platforms are you most active on?",
      type: "input",
      placeholder: "e.g., YouTube, Instagram, LinkedIn, Substack",
    },
    {
      id: "creatorCollabs",
      label: "How often do you communicate with brands or collaborators?",
      type: "select",
      options: ["Daily", "Weekly", "Occasionally", "Rarely"],
    },
    {
      id: "creatorInboxType",
      label: "Is your inbox filled more with fan mail, brand requests, or both?",
      type: "select",
      options: ["Fan messages", "Brand collaborations", "Both equally"],
    },
    {
      id: "creatorManagement",
      label: "Do you handle emails yourself or through a team/manager?",
      type: "select",
      options: ["Myself", "Team/Agency", "Mix of both"],
    },
    {
      id: "creatorWorkflow",
      label: "How do you typically manage communication for sponsorships or content planning?",
      type: "input",
      placeholder: "e.g., Notion board, Email threads, Calendar system",
    },
  ],
};

export default QuestionMap;