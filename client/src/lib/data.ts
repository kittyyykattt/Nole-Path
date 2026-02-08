export interface StudentProfile {
  name: string;
  school: string;
  major: string;
  year: string;
  interests: string[];
  skills: string[];
  experience: string[];
  focusTrack: string;
}

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  source: "Web" | "Nole Network";
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  posted: string;
  type: string;
  paid: boolean;
}

export interface ChecklistItem {
  id: number;
  text: string;
  category: "Skills" | "Resume" | "Networking" | "Applications" | "Interview Prep";
  completed: boolean;
  suggestedByCoach: boolean;
}

export interface Mentor {
  id: number;
  name: string;
  gradYear: number;
  company: string;
  role: string;
  tags: string[];
  whyMatched: string;
  outreachMessage: string;
}

export interface ChatMessage {
  id: number;
  role: "user" | "coach";
  text: string;
  timestamp: string;
}

export const studentProfile: StudentProfile = {
  name: "Maya Rodriguez",
  school: "Florida State University",
  major: "Computer Science",
  year: "Junior",
  interests: ["Front-End / Full-Stack internships", "AI-adjacent products"],
  skills: ["JavaScript", "React", "HTML/CSS", "Python", "Git", "SQL"],
  experience: [
    "Women in CS club member",
    "1 class project (web app)",
    "Part-time campus job",
  ],
  focusTrack: "Front-End SWE Intern",
};

export const jobs: Job[] = [
  {
    id: 1,
    title: "Front-End Software Engineering Intern",
    company: "TechVentures Inc.",
    location: "Miami, FL",
    remote: false,
    source: "Web",
    description:
      "Join our product team to build user-facing features using React, TypeScript, and modern CSS frameworks. You'll work alongside senior engineers on real shipping products used by thousands of customers. Ideal for students with strong JavaScript fundamentals and a passion for UI/UX.",
    requiredSkills: ["JavaScript", "React", "HTML/CSS", "Git"],
    preferredSkills: ["TypeScript", "Tailwind CSS", "Figma"],
    posted: "2 days ago",
    type: "Internship",
    paid: true,
  },
  {
    id: 2,
    title: "Full-Stack Developer Intern",
    company: "Bright Health Solutions",
    location: "Orlando, FL",
    remote: true,
    source: "Nole Network",
    description:
      "Help us build and maintain web applications for our healthcare platform. You'll contribute to both frontend React components and backend Node.js services. Great opportunity to gain full-stack experience in a mission-driven company.",
    requiredSkills: ["JavaScript", "React", "Node.js", "SQL"],
    preferredSkills: ["Python", "Docker", "AWS"],
    posted: "1 day ago",
    type: "Internship",
    paid: true,
  },
  {
    id: 3,
    title: "Software Engineering Intern - AI Products",
    company: "NovaMind AI",
    location: "San Francisco, CA",
    remote: true,
    source: "Web",
    description:
      "Work on cutting-edge AI-powered web applications. Build intuitive interfaces for machine learning tools and help design user experiences for complex AI workflows. Python and JavaScript skills are a must.",
    requiredSkills: ["Python", "JavaScript", "Git"],
    preferredSkills: ["React", "Machine Learning", "TensorFlow"],
    posted: "3 days ago",
    type: "Internship",
    paid: true,
  },
  {
    id: 4,
    title: "UI/UX Engineering Intern",
    company: "DesignForward Studio",
    location: "Tallahassee, FL",
    remote: false,
    source: "Nole Network",
    description:
      "Bridge the gap between design and development. Create pixel-perfect implementations of design mockups and build reusable component libraries. Close collaboration with our design team on real client projects.",
    requiredSkills: ["HTML/CSS", "JavaScript", "React"],
    preferredSkills: ["Figma", "Storybook", "Accessibility"],
    posted: "5 days ago",
    type: "Internship",
    paid: true,
  },
  {
    id: 5,
    title: "Web Development Intern",
    company: "GovTech Solutions",
    location: "Tallahassee, FL",
    remote: false,
    source: "Nole Network",
    description:
      "Support the development of web applications used by state government agencies. Focus on accessibility, performance, and clean code practices. Great exposure to large-scale enterprise applications.",
    requiredSkills: ["HTML/CSS", "JavaScript", "Git"],
    preferredSkills: ["React", "Section 508 Compliance", "Agile"],
    posted: "1 week ago",
    type: "Internship",
    paid: true,
  },
  {
    id: 6,
    title: "React Native Mobile Intern",
    company: "AppFlow Labs",
    location: "Austin, TX",
    remote: true,
    source: "Web",
    description:
      "Build cross-platform mobile applications using React Native. Work with our team to ship features to both iOS and Android simultaneously. Experience with React web development is a strong plus.",
    requiredSkills: ["JavaScript", "React", "Git"],
    preferredSkills: ["React Native", "Mobile Development", "Redux"],
    posted: "4 days ago",
    type: "Internship",
    paid: true,
  },
  {
    id: 7,
    title: "Data Engineering Intern",
    company: "DataStream Analytics",
    location: "Jacksonville, FL",
    remote: false,
    source: "Web",
    description:
      "Help build ETL pipelines and data visualization dashboards. Work with SQL databases, Python scripting, and modern BI tools. Strong analytical thinking and attention to detail required.",
    requiredSkills: ["Python", "SQL", "Git"],
    preferredSkills: ["Pandas", "Apache Spark", "Tableau"],
    posted: "3 days ago",
    type: "Internship",
    paid: true,
  },
  {
    id: 8,
    title: "Frontend Intern - E-Commerce Platform",
    company: "ShopNest",
    location: "Atlanta, GA",
    remote: true,
    source: "Web",
    description:
      "Join our front-end team working on a fast-growing e-commerce platform. Build responsive shopping experiences, optimize checkout flows, and implement A/B testing frameworks. High-impact role on a small, agile team.",
    requiredSkills: ["JavaScript", "React", "HTML/CSS"],
    preferredSkills: ["Next.js", "GraphQL", "Performance Optimization"],
    posted: "2 days ago",
    type: "Internship",
    paid: true,
  },
  {
    id: 9,
    title: "Software Intern - Student Services",
    company: "Florida State University IT",
    location: "Tallahassee, FL",
    remote: false,
    source: "Nole Network",
    description:
      "Work within FSU's IT department to build and maintain internal tools used by students and faculty. Gain experience with full-stack web development in an academic environment.",
    requiredSkills: ["HTML/CSS", "JavaScript", "SQL"],
    preferredSkills: ["Python", "React", "Agile"],
    posted: "6 days ago",
    type: "Internship",
    paid: true,
  },
  {
    id: 10,
    title: "Cloud & DevOps Intern",
    company: "SkyOps Technologies",
    location: "Tampa, FL",
    remote: true,
    source: "Web",
    description:
      "Learn cloud infrastructure and DevOps practices. Help manage CI/CD pipelines, write automation scripts, and monitor cloud services. Ideal for students interested in infrastructure and reliability.",
    requiredSkills: ["Git", "Python", "Linux"],
    preferredSkills: ["AWS", "Docker", "Kubernetes", "Terraform"],
    posted: "1 week ago",
    type: "Internship",
    paid: false,
  },
  {
    id: 11,
    title: "Product Engineering Intern",
    company: "Innovatech Corp",
    location: "Remote",
    remote: true,
    source: "Web",
    description:
      "Join a cross-functional product team building SaaS tools for small businesses. You'll participate in sprint planning, build features end-to-end, and ship code weekly. Fast-paced startup environment.",
    requiredSkills: ["JavaScript", "React", "Git", "HTML/CSS"],
    preferredSkills: ["Node.js", "PostgreSQL", "CI/CD"],
    posted: "2 days ago",
    type: "Internship",
    paid: true,
  },
  {
    id: 12,
    title: "Junior QA & Test Automation Intern",
    company: "QualityFirst Software",
    location: "Fort Lauderdale, FL",
    remote: false,
    source: "Web",
    description:
      "Learn software quality assurance and test automation. Write automated tests, perform manual testing, and help improve our testing infrastructure. Great entry point into software engineering.",
    requiredSkills: ["JavaScript", "Git"],
    preferredSkills: ["Selenium", "Cypress", "Jest", "Python"],
    posted: "5 days ago",
    type: "Internship",
    paid: true,
  },
];

export const altJobs: Job[] = [
  ...jobs.slice(6),
  ...jobs.slice(0, 6),
];

export const initialChecklist: ChecklistItem[] = [
  { id: 1, text: "Tailor resume to Front-End Intern roles", category: "Resume", completed: false, suggestedByCoach: false },
  { id: 2, text: "Add 2 React projects to portfolio", category: "Skills", completed: true, suggestedByCoach: false },
  { id: 3, text: "Practice 10 JS interview questions", category: "Interview Prep", completed: false, suggestedByCoach: false },
  { id: 4, text: "Complete a SQL basics module", category: "Skills", completed: false, suggestedByCoach: true },
  { id: 5, text: "Reach out to 2 alumni mentors", category: "Networking", completed: false, suggestedByCoach: false },
  { id: 6, text: "Apply to 5 internships this week", category: "Applications", completed: false, suggestedByCoach: false },
  { id: 7, text: "Update LinkedIn headline and summary", category: "Networking", completed: true, suggestedByCoach: false },
  { id: 8, text: "Schedule a Career Center resume review", category: "Resume", completed: false, suggestedByCoach: true },
  { id: 9, text: "Build a personal portfolio website", category: "Skills", completed: false, suggestedByCoach: false },
  { id: 10, text: "Practice STAR method for behavioral questions", category: "Interview Prep", completed: false, suggestedByCoach: true },
  { id: 11, text: "Attend the Spring Career Fair", category: "Networking", completed: false, suggestedByCoach: false },
  { id: 12, text: "Review company research for top 3 matches", category: "Applications", completed: false, suggestedByCoach: false },
  { id: 13, text: "Learn TypeScript fundamentals", category: "Skills", completed: false, suggestedByCoach: true },
  { id: 14, text: "Write a cover letter template", category: "Applications", completed: true, suggestedByCoach: false },
  { id: 15, text: "Do a mock interview with Career Center", category: "Interview Prep", completed: false, suggestedByCoach: false },
];

export const mentors: Mentor[] = [
  {
    id: 1,
    name: "Alex Chen",
    gradYear: 2021,
    company: "Google",
    role: "Front-End Engineer",
    tags: ["React", "JavaScript", "UI/UX"],
    whyMatched: "Shares your interest in front-end development and transitioned from a similar CS background at FSU. Can advise on building a strong portfolio.",
    outreachMessage: "Hi Alex,\n\nI'm Maya Rodriguez, a junior CS major at FSU focusing on front-end development. I noticed you graduated from FSU and are now a Front-End Engineer at Google. I'd love to hear about your journey from FSU to Google and any advice on preparing for front-end internships.\n\nWould you be open to a brief 15-minute chat?\n\nBest,\nMaya",
  },
  {
    id: 2,
    name: "Jasmine Williams",
    gradYear: 2022,
    company: "Microsoft",
    role: "Software Engineer",
    tags: ["Full-Stack", "Python", "Cloud"],
    whyMatched: "Also a Women in CS club alum and can share tips on landing internships at major tech companies straight out of FSU.",
    outreachMessage: "Hi Jasmine,\n\nI'm Maya Rodriguez, a fellow Women in CS member at FSU. I'm currently a junior looking for front-end/full-stack internships. I'd love to learn about your experience going from FSU to Microsoft.\n\nWould you have time for a short virtual coffee chat?\n\nThanks,\nMaya",
  },
  {
    id: 3,
    name: "Marcus Johnson",
    gradYear: 2020,
    company: "Meta",
    role: "Product Engineer",
    tags: ["React", "Product", "AI"],
    whyMatched: "Works on AI-adjacent products at Meta and uses React daily. Great match for your interest in AI-adjacent product development.",
    outreachMessage: "Hi Marcus,\n\nI'm Maya Rodriguez, a CS junior at FSU interested in AI-adjacent product work. Your role as a Product Engineer at Meta caught my attention since it aligns with my career interests.\n\nI'd appreciate any insights on breaking into product engineering roles. Would you be available for a brief chat?\n\nBest regards,\nMaya",
  },
  {
    id: 4,
    name: "Sarah Mitchell",
    gradYear: 2023,
    company: "Spotify",
    role: "Frontend Developer",
    tags: ["JavaScript", "CSS", "Design Systems"],
    whyMatched: "Recently went through the internship process and can provide up-to-date advice on applications, interviewing, and what companies look for in junior developers.",
    outreachMessage: "Hi Sarah,\n\nI'm Maya, a junior at FSU studying CS. I'm inspired by your path to Spotify as a Frontend Developer. Since you recently went through the internship and job search process, I'd love to hear what worked for you.\n\nWould you be open to sharing your experience?\n\nThank you,\nMaya",
  },
  {
    id: 5,
    name: "David Park",
    gradYear: 2019,
    company: "Amazon",
    role: "Senior SDE",
    tags: ["Full-Stack", "System Design", "Mentoring"],
    whyMatched: "Known for mentoring FSU students and has helped several Seminoles land internships at top companies. Active in the Nole Network community.",
    outreachMessage: "Hi David,\n\nI'm Maya Rodriguez, a CS junior at FSU. I've heard you're an active mentor in the Nole Network, and I'd love to connect. I'm targeting front-end/full-stack internships and would value your guidance.\n\nCould we schedule a brief chat at your convenience?\n\nBest,\nMaya",
  },
  {
    id: 6,
    name: "Rachel Torres",
    gradYear: 2021,
    company: "Stripe",
    role: "Full-Stack Engineer",
    tags: ["JavaScript", "React", "Payments"],
    whyMatched: "Works on complex React interfaces at Stripe. Her experience with fintech products gives unique insight into building reliable, user-facing applications.",
    outreachMessage: "Hi Rachel,\n\nI'm Maya Rodriguez, a CS junior at FSU interested in full-stack development. Your work on React interfaces at Stripe sounds fascinating. I'd love to learn about your journey and any tips for landing internships in fintech.\n\nWould you be free for a short conversation?\n\nThanks,\nMaya",
  },
  {
    id: 7,
    name: "James Wright",
    gradYear: 2022,
    company: "Figma",
    role: "Design Engineer",
    tags: ["UI/UX", "React", "Design Systems"],
    whyMatched: "Bridge between design and engineering, matching your interest in UI/UX. Can advise on building a design-engineering portfolio.",
    outreachMessage: "Hi James,\n\nI'm Maya Rodriguez, a CS junior at FSU with a strong interest in the intersection of design and engineering. Your role as a Design Engineer at Figma is exactly the kind of career path I'm exploring.\n\nWould you have time for a quick chat about your experience?\n\nBest,\nMaya",
  },
  {
    id: 8,
    name: "Nicole Adams",
    gradYear: 2020,
    company: "LinkedIn",
    role: "Staff Engineer",
    tags: ["React", "Accessibility", "Performance"],
    whyMatched: "Expert in web accessibility and performance optimization. Can provide guidance on standing out with specialized frontend skills.",
    outreachMessage: "Hi Nicole,\n\nI'm Maya Rodriguez, a CS junior at FSU focusing on front-end development. Your expertise in accessibility and performance at LinkedIn is inspiring. I'd love to learn how these specialties can help differentiate a junior developer.\n\nWould you be open to a brief conversation?\n\nThank you,\nMaya",
  },
];

export function calculateCompatibility(job: Job): {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  matchedPreferred: string[];
  recommendations: string[];
} {
  const userSkills = studentProfile.skills.map((s) => s.toLowerCase());
  let score = 50;

  const matchedSkills = job.requiredSkills.filter((s) =>
    userSkills.includes(s.toLowerCase())
  );
  const missingSkills = job.requiredSkills.filter(
    (s) => !userSkills.includes(s.toLowerCase())
  );
  const matchedPreferred = job.preferredSkills.filter((s) =>
    userSkills.includes(s.toLowerCase())
  );

  score += Math.min(matchedSkills.length * 5, 30);
  score += Math.min(matchedPreferred.length * 3, 15);
  score -= Math.min(missingSkills.length * 5, 30);
  score = Math.max(0, Math.min(100, score));

  const recommendations: string[] = [];
  if (missingSkills.length > 0) {
    recommendations.push(
      `Learn ${missingSkills[0]} through an online course or tutorial`
    );
  }
  if (missingSkills.length > 1) {
    recommendations.push(
      `Add a project using ${missingSkills[1]} to your portfolio`
    );
  }
  recommendations.push("Tailor your resume keywords to this job description");
  if (matchedSkills.length < job.requiredSkills.length) {
    recommendations.push("Schedule a Career Center advising session to discuss skill gaps");
  }

  return { score, matchedSkills, missingSkills, matchedPreferred, recommendations };
}

export const coachResponses: Record<string, string> = {
  "Find roles like this":
    "Based on the selected job, here are similar roles I'd recommend:\n\n1. **Product Engineering Intern** at Innovatech Corp - Strong React/JS match (Score: 85)\n2. **Frontend Intern - E-Commerce** at ShopNest - Great HTML/CSS + React fit (Score: 82)\n3. **UI/UX Engineering Intern** at DesignForward Studio - Local to Tallahassee! (Score: 78)\n\nI suggest applying to all three this week. Want me to help tailor your resume for any of these?",
  "Improve my resume bullet":
    "Here's how to strengthen your resume bullets using the STAR method:\n\n**Before:** \"Worked on a web app for class project\"\n\n**After:** \"Developed a responsive web application using React and Node.js that enabled 50+ students to track study group schedules, improving group coordination by 40%\"\n\n**Key tips:**\n- Start with a strong action verb\n- Include specific technologies used\n- Quantify the impact where possible\n- Focus on results, not just tasks\n\nWant me to help rewrite more bullets?",
  "Build a 2-week plan":
    "Here's your personalized 2-week internship prep plan:\n\n**Week 1: Foundation**\n- Mon-Tue: Update resume with Career Center feedback\n- Wed: Research top 5 target companies\n- Thu: Complete 1 React portfolio project\n- Fri: Practice 5 JavaScript interview questions\n\n**Week 2: Apply & Network**\n- Mon-Tue: Submit 3 applications with tailored resumes\n- Wed: Reach out to 2 alumni mentors on Nole Network\n- Thu: Practice behavioral questions (STAR method)\n- Fri: Review and refine remaining applications\n\nShall I add these items to your checklist?",
  "Mock interview questions":
    "Here are practice questions tailored to Front-End SWE Intern roles:\n\n**Technical:**\n1. Explain the difference between `let`, `const`, and `var` in JavaScript.\n2. How does React's virtual DOM work?\n3. What is CSS specificity and how does it affect styling?\n4. Describe how you would make a website accessible.\n\n**Behavioral:**\n1. Tell me about a time you worked on a team project. What was your role?\n2. Describe a technical challenge you overcame recently.\n3. Why are you interested in front-end development?\n\n**Tips:** Practice answering out loud, time yourself (2 min per answer), and schedule a mock interview with the Career Center.\n\nWant me to help you prepare answers for any of these?",
};

export const walkthroughSteps = [
  {
    title: "Collected Your Profile",
    description: "Gathered your academic info, skills, experience, and career interests to build a personalized coaching plan.",
    output: `Name: ${studentProfile.name}\nSchool: ${studentProfile.school}\nMajor: ${studentProfile.major} (${studentProfile.year})\nSkills: ${studentProfile.skills.join(", ")}\nInterests: ${studentProfile.interests.join(", ")}\nFocus Track: ${studentProfile.focusTrack}`,
  },
  {
    title: "Aggregated Jobs (Web + Nole Network)",
    description: "Searched across external job boards and FSU's Nole Network to compile relevant internship listings.",
    output: `Found ${jobs.length} internship listings:\n- ${jobs.filter((j) => j.source === "Web").length} from Web sources\n- ${jobs.filter((j) => j.source === "Nole Network").length} from Nole Network\n\nLocations: Miami, Orlando, Tallahassee, San Francisco, Austin, Atlanta, Tampa, Jacksonville, Fort Lauderdale, Remote`,
  },
  {
    title: "Ranked Matches with Compatibility Scoring",
    description: "Compared your skills against each job's requirements and preferences to generate compatibility scores.",
    output: `Top 3 Matches:\n1. Front-End SWE Intern at TechVentures Inc. - Score: ${calculateCompatibility(jobs[0]).score}%\n2. Full-Stack Developer Intern at Bright Health - Score: ${calculateCompatibility(jobs[1]).score}%\n3. Product Engineering Intern at Innovatech - Score: ${calculateCompatibility(jobs[10]).score}%\n\nScoring: Base 50 + matched required skills (+5 ea) + matched preferred (+3 ea) - missing requirements (-5 ea)`,
  },
  {
    title: "Identified Skill Gaps",
    description: "Analyzed the gap between your current skills and what top-matching employers are looking for.",
    output: "Key skill gaps across top matches:\n- TypeScript (requested by 4 of top 5 matches)\n- Docker (requested by 3 roles)\n- Node.js (required for full-stack positions)\n- AWS/Cloud basics (growing demand)\n\nRecommended learning order: TypeScript > Node.js > Docker > Cloud",
  },
  {
    title: "Generated Checklist Plan",
    description: "Created a structured action plan with prioritized tasks across skills, resume, networking, and applications.",
    output: `Generated ${initialChecklist.length} checklist items:\n- Skills: ${initialChecklist.filter((c) => c.category === "Skills").length} tasks\n- Resume: ${initialChecklist.filter((c) => c.category === "Resume").length} tasks\n- Networking: ${initialChecklist.filter((c) => c.category === "Networking").length} tasks\n- Applications: ${initialChecklist.filter((c) => c.category === "Applications").length} tasks\n- Interview Prep: ${initialChecklist.filter((c) => c.category === "Interview Prep").length} tasks`,
  },
  {
    title: "Tailored Resume & ATS Improvements",
    description: "Scanned your resume against ATS systems and generated optimized bullet points for target roles.",
    output: "ATS Score: 68/100\n\nMissing keywords: TypeScript, responsive design, agile, REST APIs, unit testing\n\nSuggested improvements:\n- Add quantified achievements to project descriptions\n- Include relevant coursework section\n- Optimize formatting for ATS parsing\n- Add a skills section matching job posting keywords",
  },
  {
    title: "Suggested Mentors + Outreach Drafts",
    description: "Matched you with FSU alumni mentors based on your interests and career goals, with ready-to-send messages.",
    output: `Matched ${mentors.length} alumni mentors:\n- ${mentors.map((m) => `${m.name} (${m.company}, ${m.role})`).join("\n- ")}\n\nOutreach messages drafted for each mentor.\nTip: Personalize the message with a specific question about their role.`,
  },
];
