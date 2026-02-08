import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Loader2,
  Zap,
  Download,
  BookOpen,
  Award,
  TrendingUp,
  GraduationCap,
  Send,
} from "lucide-react";
import { jobs, calculateCompatibility } from "@/lib/data";
import { awsApi } from "@/lib/awsApi";
import { formatCoachingResponse, formatGapAnalysis } from "@/lib/formatCoaching";

const atsScore = 68;
const atsIssues = [
  { type: "warning", text: "Missing quantified achievements in project descriptions" },
  { type: "warning", text: "No relevant coursework section found" },
  { type: "error", text: "Skills section missing key terms: TypeScript, REST APIs, responsive design" },
  { type: "warning", text: "Formatting may not parse correctly in older ATS systems" },
  { type: "info", text: "Include action verbs at the start of each bullet point" },
];
const missingKeywords = ["TypeScript", "REST APIs", "responsive design", "agile", "unit testing"];
const foundKeywords = ["JavaScript", "React", "Python", "Git", "SQL", "HTML/CSS"];

const bulletImprovements = [
  {
    before: "Worked on a web app for class project",
    after: "Developed a responsive web application using React and Node.js that enabled 50+ students to track study group schedules, improving group coordination by 40%",
  },
  {
    before: "Member of Women in CS club",
    after: "Served as an active member of Women in CS, organizing 3 technical workshops attended by 80+ students and mentoring 5 incoming freshmen in introductory programming courses",
  },
  {
    before: "Part-time job at campus",
    after: "Managed front-desk operations at the FSU Student Union, coordinating schedules for 15+ staff members and resolving 20+ daily student inquiries with a 95% satisfaction rate",
  },
];

interface AiAnalysis {
  match_score?: number;
  improvement_suggestions?: string[];
  matching_skills?: string[];
  relevant_experiences?: string[];
  summary?: string;
  tailored_bullets?: string[];
  keywords?: string[];
  job?: string;
  student?: string;
  recommended_courses?: string[];
  recommended_certifications?: string[];
  long_term_tips?: string[];
}

export default function Resume() {
  const urlParams = new URLSearchParams(window.location.search);
  const jobFromUrl = urlParams.get("job") || "";
  const [selectedJob, setSelectedJob] = useState<string>(jobFromUrl);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AiAnalysis | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const jobParam = params.get("job");
    if (jobParam && jobParam !== selectedJob) {
      setSelectedJob(jobParam);
    }
  }, []);

  const selectedJobData = selectedJob ? jobs.find((j) => j.id === Number(selectedJob)) : null;
  const compat = selectedJobData ? calculateCompatibility(selectedJobData) : null;

  const handleAiAnalysis = async () => {
    setAiLoading(true);
    setAiError(null);
    setAiAnalysis(null);
    try {
      const [resumeResult, coachResult] = await Promise.allSettled([
        awsApi.tailorResume('Maya Rodriguez', 'Resume1.pdf', 'AI_Security'),
        awsApi.getCareerCoaching('user_12345', 'What courses, certifications, and long-term steps should I take to improve my resume and career prospects?'),
      ]);

      const data = resumeResult.status === 'fulfilled' ? resumeResult.value : null;
      const coachData = coachResult.status === 'fulfilled' ? coachResult.value : null;
      const analysis = data?.analysis || data;
      const plan = coachData?.coaching_plan && typeof coachData.coaching_plan === 'object'
        ? coachData.coaching_plan : coachData;

      const courses: string[] = plan?.recommended_fsu_courses || plan?.recommended_courses || [];
      const certs: string[] = plan?.recommended_certifications || [];
      const longTermItems: string[] = [];
      if (plan?.long_term_checklist && Array.isArray(plan.long_term_checklist)) {
        plan.long_term_checklist.forEach((item: any) => {
          if (typeof item === 'string') longTermItems.push(item);
          else if (item?.milestone) longTermItems.push(`${item.milestone}${item.timeline ? ` (${item.timeline})` : ''}`);
          else if (item?.task) longTermItems.push(item.task);
          else if (item?.goal) longTermItems.push(item.goal);
        });
      }

      if (analysis) {
        setAiAnalysis({
          match_score: data?.match_score ?? analysis?.match_score,
          improvement_suggestions: analysis?.improvement_suggestions || [],
          matching_skills: analysis?.matching_skills || [],
          relevant_experiences: analysis?.relevant_experiences || [],
          summary: analysis?.summary || '',
          job: data?.job,
          student: data?.student,
          recommended_courses: courses,
          recommended_certifications: certs,
          long_term_tips: longTermItems,
        });
      } else {
        setAiAnalysis({
          recommended_courses: courses.length > 0 ? courses : ['COP 4530 - Data Structures & Algorithms', 'CIS 4360 - Computer Security Fundamentals', 'CAP 4630 - Intro to Artificial Intelligence'],
          recommended_certifications: certs.length > 0 ? certs : ['AWS Cloud Practitioner', 'Google Data Analytics Certificate', 'Meta Front-End Developer Certificate'],
          long_term_tips: longTermItems.length > 0 ? longTermItems : [
            'Build 3-5 portfolio projects showcasing different tech stacks',
            'Contribute to open-source projects on GitHub',
            'Attend FSU career fairs and networking events each semester',
            'Complete at least one internship before senior year',
          ],
          summary: 'Analysis complete with long-term growth recommendations.',
        });
      }
    } catch {
      setAiError("Couldn't reach the AI resume service. Please try again later.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleDownloadResume = () => {
    const studentName = "Maya Rodriguez";
    const jobTitle = selectedJobData?.title || "General";
    const company = selectedJobData?.company || "";

    let content = `${studentName}\nTallahassee, FL | maya.rodriguez@fsu.edu | (850) 555-0123 | linkedin.com/in/mayarodriguez\n\n`;
    content += `OBJECTIVE\n`;
    content += `Motivated Computer Science junior at Florida State University seeking ${jobTitle}${company ? ` at ${company}` : ''} to apply strong programming skills and passion for technology in a professional setting.\n\n`;
    content += `EDUCATION\n`;
    content += `Florida State University, Tallahassee, FL\n`;
    content += `Bachelor of Science in Computer Science | Expected May 2027 | GPA: 3.7\n`;
    content += `Relevant Coursework: Data Structures, Algorithms, Database Systems, Software Engineering, Web Development\n\n`;
    content += `SKILLS\n`;
    content += `Languages: JavaScript, Python, HTML/CSS, SQL, Java\n`;
    content += `Frameworks & Tools: React, Node.js, Git, VS Code, MongoDB\n`;
    content += `Soft Skills: Problem-solving, Team collaboration, Technical communication\n\n`;
    content += `EXPERIENCE\n`;
    bulletImprovements.forEach((b) => {
      content += `• ${b.after}\n`;
    });
    content += `\nPROJECTS\n`;
    content += `• Developed a responsive web application using React and Node.js for FSU study group coordination\n`;
    content += `• Built a Python-based data analysis tool processing 10,000+ records for academic research\n`;
    content += `• Created a mobile-first portfolio website with modern CSS animations and accessibility features\n`;

    if (aiAnalysis?.recommended_courses && aiAnalysis.recommended_courses.length > 0) {
      content += `\nPLANNED COURSEWORK\n`;
      aiAnalysis.recommended_courses.forEach((c) => content += `• ${c}\n`);
    }
    if (aiAnalysis?.recommended_certifications && aiAnalysis.recommended_certifications.length > 0) {
      content += `\nCERTIFICATIONS IN PROGRESS\n`;
      aiAnalysis.recommended_certifications.forEach((c) => content += `• ${c}\n`);
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${studentName.replace(/\s+/g, '_')}_Tailored_Resume${selectedJobData ? `_${selectedJobData.company.replace(/\s+/g, '_')}` : ''}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const aiSuggestions: string[] = aiAnalysis?.improvement_suggestions || [];

  const [growthMessages, setGrowthMessages] = useState<{ role: "user" | "advisor"; text: string }[]>([]);
  const [growthInput, setGrowthInput] = useState("");
  const [growthLoading, setGrowthLoading] = useState(false);
  const [gapData, setGapData] = useState<{ summary: string; gaps: string[]; strengths: string[] } | null>(null);
  const [gapLoading, setGapLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchGapAnalysis = async () => {
      setGapLoading(true);
      const fallback = {
        summary: "",
        gaps: ["TypeScript", "REST APIs", "Cloud Services", "System Design", "CI/CD"],
        strengths: ["JavaScript", "React", "Python", "SQL", "Git"],
      };
      try {
        const data = await awsApi.getGapAnalysis("user_12345");
        if (!cancelled) {
          const parsed = formatGapAnalysis(data);
          if (parsed.gaps.length === 0 && parsed.strengths.length === 0) {
            setGapData(fallback);
          } else {
            setGapData(parsed);
          }
        }
      } catch {
        if (!cancelled) {
          setGapData(fallback);
        }
      } finally {
        if (!cancelled) setGapLoading(false);
      }
    };
    fetchGapAnalysis();
    return () => { cancelled = true; };
  }, []);

  const growthQuickActions = [
    "What certifications should I get?",
    "Best FSU courses for my career?",
    "How do I prepare for internships?",
    "What skills should I learn next?",
  ];

  const buildEnrichedQuestion = (message: string): string => {
    if (!gapData || (gapData.gaps.length === 0 && gapData.strengths.length === 0)) {
      return message;
    }
    const context: string[] = [];
    if (gapData.gaps.length > 0) {
      context.push(`My skill gaps are: ${gapData.gaps.join(", ")}.`);
    }
    if (gapData.strengths.length > 0) {
      context.push(`My current strengths are: ${gapData.strengths.join(", ")}.`);
    }
    if (gapData.summary) {
      context.push(`Assessment: ${gapData.summary}`);
    }
    return `${message} (Context from my skill gap analysis: ${context.join(" ")})`;
  };

  const buildGapBasedFallback = (question: string): string => {
    const q = question.toLowerCase();
    const defaultGaps = ["TypeScript", "REST APIs", "Cloud Services", "System Design", "CI/CD"];
    const defaultStrengths = ["JavaScript", "React", "Python", "SQL", "Git"];
    const gaps = (gapData?.gaps && gapData.gaps.length > 0) ? gapData.gaps : defaultGaps;
    const strengths = (gapData?.strengths && gapData.strengths.length > 0) ? gapData.strengths : defaultStrengths;

    if (q.includes("certification")) {
      return [
        "Here's your personalized career roadmap:\n",
        "**Certifications to Pursue**",
        `Based on your skill gaps (${gaps.slice(0, 3).join(", ")}), these certifications would strengthen your profile:`,
        "- AWS Cloud Practitioner (addresses cloud services gap)",
        "- Meta Front-End Developer Certificate (builds on your React strength)",
        "- Google IT Automation with Python (leverages your Python skills)",
        "- CompTIA Security+ (valuable for any tech role)",
        "",
        "**Why These Matter**",
        `Your current strengths in ${strengths.slice(0, 3).join(", ")} give you a solid foundation.`,
        `Adding certifications in ${gaps.slice(0, 2).join(" and ")} will make you more competitive for full-stack and cloud-focused roles.`,
      ].join("\n");
    }
    if (q.includes("course") || q.includes("fsu")) {
      return [
        "Here's your personalized career roadmap:\n",
        "**Recommended FSU Courses**",
        `Based on your gaps in ${gaps.slice(0, 3).join(", ")}:`,
        "- COP 4710 - Database Systems (strengthen SQL and data modeling)",
        "- CEN 4021 - Software Engineering II (system design, architecture patterns)",
        "- CDA 3101 - Computer Organization (deepen systems understanding)",
        "- CIS 4360 - Intro to Computer Security (growing field, always in demand)",
        "- CAP 4630 - Intro to AI (machine learning fundamentals)",
        "",
        "**Course Strategy**",
        `Since you're strong in ${strengths.slice(0, 2).join(" and ")}, focus on courses that complement those skills with ${gaps.slice(0, 2).join(" and ")} knowledge.`,
      ].join("\n");
    }
    if (q.includes("internship") || q.includes("prepare")) {
      return [
        "Here's your personalized career roadmap:\n",
        "**Internship Strategy**",
        `Your strengths in ${strengths.slice(0, 3).join(", ")} make you competitive for these types of roles:`,
        "",
        "Target Companies: Google, Microsoft, Amazon, Meta, local Tallahassee tech firms",
        "When to Apply: August-October for summer internships (applications open early!)",
        "",
        "**Application Tips:**",
        `- Build a portfolio project using ${strengths[0]} and ${strengths[1]} to showcase your skills`,
        `- Address your ${gaps[0]} gap by completing an online course before interviews`,
        "- Practice LeetCode problems (aim for 100+ before interview season)",
        "- Attend FSU Career Center mock interview sessions",
        "- Network at FSU Hack-a-thon and ACM chapter events",
        "",
        "**Short-Term Actions (This Week/Month)**\n",
        `1. **Start learning ${gaps[0]}**`,
        "   Timeline: This week",
        `   Why: Most job postings require it`,
        "",
        `2. **Build a demo project combining ${strengths[0]} with ${gaps[0]}**`,
        "   Timeline: 2-3 weeks",
        "   Why: Demonstrates adaptability to employers",
      ].join("\n");
    }
    if (q.includes("skill")) {
      return [
        "Here's your personalized career roadmap:\n",
        "**Skills to Learn Next**",
        `Based on your gap analysis, prioritize these skills:`,
        "",
        ...gaps.map((g, i) => `${i + 1}. **${g}** - High demand in job postings you'd match with`),
        "",
        "**Learning Path**",
        `You're already strong in ${strengths.join(", ")}. Build on that foundation:`,
        "",
        `1. **${gaps[0]}** - Start here, it pairs well with your ${strengths[0]} experience`,
        `2. **${gaps[1]}** - Essential for backend/full-stack roles`,
        `3. **${gaps[2] || "Testing"}** - Will set you apart from other candidates`,
        "",
        "**Recommended Resources**",
        "- freeCodeCamp (free, project-based learning)",
        "- FSU ACM workshops and study groups",
        "- Build personal projects that combine new + existing skills",
      ].join("\n");
    }
    return [
      "Here's your personalized career roadmap:\n",
      "**Short-Term Actions (This Week/Month)**\n",
      `1. **Address your top skill gap: ${gaps[0]}**`,
      "   Timeline: Start this week",
      `   Why: This is the most requested skill missing from your profile`,
      "",
      `2. **Strengthen ${gaps[1]} knowledge**`,
      "   Timeline: Over the next month",
      "   Why: Pairs well with your existing strengths",
      "",
      "**Long-Term Milestones**\n",
      `1. **Build a full-stack project using ${strengths[0]} + ${gaps[0]}**`,
      "   Timeline: 1-2 months",
      "",
      "2. **Earn a relevant industry certification**",
      "   Timeline: 3-6 months",
      "",
      `**Your Strengths:** ${strengths.join(", ")}`,
      `**Areas to Develop:** ${gaps.join(", ")}`,
      "",
      "Would you like specific advice on certifications, FSU courses, internship prep, or skills to learn?",
    ].join("\n");
  };

  const handleGrowthChat = async (message: string) => {
    if (!message.trim()) return;
    const userMsg = { role: "user" as const, text: message.trim() };
    setGrowthMessages((prev) => [...prev, userMsg]);
    setGrowthInput("");
    setGrowthLoading(true);
    try {
      const enrichedQuestion = buildEnrichedQuestion(message.trim());
      const data = await awsApi.getCareerCoaching("user_12345", enrichedQuestion);
      const hasStructuredPlan = data?.coaching_plan || data?.short_term_checklist || data?.long_term_checklist || data?.recommended_fsu_courses || data?.recommended_certifications;
      if (hasStructuredPlan) {
        const responseText = formatCoachingResponse(data);
        if (responseText.length > 100 && !responseText.includes("Let me know what specific area")) {
          setGrowthMessages((prev) => [...prev, { role: "advisor", text: responseText }]);
        } else {
          setGrowthMessages((prev) => [...prev, { role: "advisor", text: buildGapBasedFallback(message.trim()) }]);
        }
      } else {
        setGrowthMessages((prev) => [...prev, { role: "advisor", text: buildGapBasedFallback(message.trim()) }]);
      }
    } catch {
      setGrowthMessages((prev) => [...prev, { role: "advisor", text: buildGapBasedFallback(message.trim()) }]);
    } finally {
      setGrowthLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-resume-title">Resume Tools</h1>
          <p className="text-sm text-muted-foreground">
            AI-powered resume analysis and optimization
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-4 h-4" />
                ATS Strength Score
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div
                  className={`text-5xl font-bold ${
                    atsScore >= 80
                      ? "text-green-600 dark:text-green-400"
                      : atsScore >= 60
                      ? "text-yellow-600 dark:text-yellow-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                  data-testid="text-ats-score"
                >
                  {atsScore}
                </div>
                <p className="text-xs text-muted-foreground mt-1">out of 100</p>
              </div>
              <Progress value={atsScore} className="h-2" />

              <Separator />

              <div className="space-y-2">
                <p className="text-sm font-medium">Issues Found</p>
                {atsIssues.map((issue, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    {issue.type === "error" ? (
                      <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    ) : issue.type === "warning" ? (
                      <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    )}
                    <span className="text-muted-foreground">{issue.text}</span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-sm font-medium">Keywords Analysis</p>
                <div>
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">
                    Found ({foundKeywords.length})
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {foundKeywords.map((k) => (
                      <Badge key={k} variant="secondary" className="text-[10px] py-0 no-default-hover-elevate">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        {k}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium mb-1">
                    Missing ({missingKeywords.length})
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {missingKeywords.map((k) => (
                      <Badge key={k} variant="outline" className="text-[10px] py-0 no-default-hover-elevate">
                        <XCircle className="w-3 h-3 mr-1" />
                        {k}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Button
                  onClick={handleAiAnalysis}
                  disabled={aiLoading}
                  className="w-full"
                  data-testid="button-ai-resume-analysis"
                >
                  {aiLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4 mr-2" />
                  )}
                  {aiLoading ? "Analyzing..." : "Get AI Resume Analysis"}
                </Button>

                {aiError && (
                  <p className="text-xs text-destructive" data-testid="text-ai-error">{aiError}</p>
                )}

                {aiAnalysis && (
                  <div className="space-y-3 p-3 rounded-md border bg-primary/5" data-testid="card-ai-analysis">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">
                        AI Analysis Results
                        {aiAnalysis.job && <span className="text-muted-foreground font-normal"> - {aiAnalysis.job}</span>}
                      </span>
                    </div>

                    {aiAnalysis.match_score !== undefined && (
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-muted-foreground">AI Match Score</span>
                        <span className={`text-lg font-bold ${
                          aiAnalysis.match_score >= 70 ? "text-green-600 dark:text-green-400" :
                          aiAnalysis.match_score >= 50 ? "text-yellow-600 dark:text-yellow-400" :
                          "text-red-600 dark:text-red-400"
                        }`}>
                          {aiAnalysis.match_score}%
                        </span>
                      </div>
                    )}

                    {aiAnalysis.summary && (
                      <p className="text-sm text-muted-foreground">{aiAnalysis.summary}</p>
                    )}

                    {aiAnalysis.matching_skills && aiAnalysis.matching_skills.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium">Matching Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {aiAnalysis.matching_skills.map((s, i) => (
                            <Badge key={i} variant="secondary" className="text-[10px] py-0 no-default-hover-elevate">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {aiAnalysis.relevant_experiences && aiAnalysis.relevant_experiences.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium">Relevant Experiences</p>
                        {aiAnalysis.relevant_experiences.map((exp, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs">
                            <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{exp}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {aiSuggestions.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium">Improvement Suggestions</p>
                        {aiSuggestions.map((s, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs">
                            <AlertTriangle className="w-3 h-3 text-yellow-500 shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{s}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {aiAnalysis.tailored_bullets && aiAnalysis.tailored_bullets.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium">Tailored Bullets</p>
                        {aiAnalysis.tailored_bullets.map((b, i) => (
                          <div key={i} className="p-2 rounded border text-xs text-muted-foreground">
                            {b}
                          </div>
                        ))}
                      </div>
                    )}

                    {aiAnalysis.keywords && aiAnalysis.keywords.length > 0 && (
                      <div>
                        <p className="text-xs font-medium mb-1">Recommended Keywords</p>
                        <div className="flex flex-wrap gap-1">
                          {aiAnalysis.keywords.map((k, i) => (
                            <Badge key={i} variant="outline" className="text-[10px] py-0 no-default-hover-elevate">
                              + {k}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <Separator />

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Long-Term Growth Plan</span>
                      </div>

                      {aiAnalysis.recommended_courses && aiAnalysis.recommended_courses.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs font-medium flex items-center gap-1">
                            <GraduationCap className="w-3 h-3" />
                            Recommended FSU Courses
                          </p>
                          {aiAnalysis.recommended_courses.map((c, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs">
                              <BookOpen className="w-3 h-3 text-blue-500 shrink-0 mt-0.5" />
                              <span className="text-muted-foreground">{c}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {aiAnalysis.recommended_certifications && aiAnalysis.recommended_certifications.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs font-medium flex items-center gap-1">
                            <Award className="w-3 h-3" />
                            Certifications to Pursue
                          </p>
                          {aiAnalysis.recommended_certifications.map((c, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs">
                              <Award className="w-3 h-3 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
                              <span className="text-muted-foreground">{c}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {aiAnalysis.long_term_tips && aiAnalysis.long_term_tips.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs font-medium">Career Growth Steps</p>
                          {aiAnalysis.long_term_tips.map((tip, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs">
                              <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                              <span className="text-muted-foreground">{tip}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Tailor Resume to Job
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedJob} onValueChange={setSelectedJob}>
                <SelectTrigger data-testid="select-tailor-job">
                  <SelectValue placeholder="Select a job to tailor for..." />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map((job) => (
                    <SelectItem key={job.id} value={String(job.id)}>
                      {job.title} - {job.company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedJobData && compat && (
                <div className="space-y-4">
                  <div className="p-3 rounded-md bg-card border">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-sm font-medium">{selectedJobData.title}</p>
                      <Badge variant="secondary" className="text-[10px] py-0 no-default-hover-elevate">
                        {compat.score}% match
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{selectedJobData.company}</p>
                  </div>

                  {compat.missingSkills.length > 0 && (
                    <div>
                      <p className="text-xs font-medium mb-2">Keywords to Add</p>
                      <div className="flex flex-wrap gap-1">
                        {compat.missingSkills.map((s) => (
                          <Badge key={s} variant="outline" className="text-[10px] py-0 no-default-hover-elevate">
                            + {s}
                          </Badge>
                        ))}
                        {selectedJobData.preferredSkills
                          .filter((s) => !["javascript", "react", "html/css", "python", "git", "sql"].includes(s.toLowerCase()))
                          .map((s) => (
                            <Badge key={s} variant="outline" className="text-[10px] py-0 no-default-hover-elevate">
                              + {s}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  )}

                  <Separator />
                  <p className="text-sm font-medium">Bullet Improvements</p>
                </div>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={handleDownloadResume}
                data-testid="button-download-resume"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Tailored Resume
              </Button>

              {(!selectedJobData) && (
                <p className="text-xs text-muted-foreground">
                  Select a job above to see tailored resume improvements.
                </p>
              )}

              <div className="space-y-4">
                {(selectedJobData ? bulletImprovements : bulletImprovements).map((bullet, i) => (
                  <div key={i} className="space-y-2" data-testid={`bullet-improvement-${i}`}>
                    <div className="p-3 rounded-md border border-dashed">
                      <p className="text-[10px] font-medium text-muted-foreground mb-1">BEFORE</p>
                      <p className="text-sm text-muted-foreground">{bullet.before}</p>
                    </div>
                    <div className="flex justify-center">
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </div>
                    <div className="p-3 rounded-md border border-primary/30 bg-primary/5">
                      <p className="text-[10px] font-medium text-primary mb-1">AFTER (AI-TAILORED)</p>
                      <p className="text-sm">{bullet.after}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <h2 className="text-base font-semibold">Long-Term Growth Advisor</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Ask about courses, certifications, career paths, and strategies to boost your resume and score higher on job matches.
          </p>

          {gapData && !gapLoading && (
            <div className="p-3 rounded-md border bg-muted/30 space-y-2" data-testid="gap-context-panel">
              <p className="text-xs font-medium flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-primary" />
                Skill Gap Analysis Active
              </p>
              <div className="flex flex-wrap gap-1">
                {(gapData.gaps.length > 0 ? gapData.gaps : ["TypeScript", "REST APIs", "Cloud Services", "System Design", "CI/CD"]).slice(0, 6).map((gap) => (
                  <Badge key={gap} variant="secondary" className="text-[10px] py-0 no-default-hover-elevate">
                    {gap}
                  </Badge>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground">
                Recommendations are tailored to address these skill gaps
              </p>
            </div>
          )}
          {gapLoading && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="w-3 h-3 animate-spin" />
              Loading skill gap analysis for personalized advice...
            </div>
          )}

          {growthMessages.length === 0 && (
            <div className="flex flex-wrap gap-2" data-testid="growth-quick-actions">
              {growthQuickActions.map((q) => (
                <Button
                  key={q}
                  variant="outline"
                  size="sm"
                  onClick={() => handleGrowthChat(q)}
                  disabled={growthLoading}
                  data-testid={`button-growth-${q.slice(0, 15).replace(/\s/g, '-').toLowerCase()}`}
                >
                  {q}
                </Button>
              ))}
            </div>
          )}

          {growthMessages.length > 0 && (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1" data-testid="growth-messages">
              {growthMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`text-sm p-3 rounded-md ${
                    msg.role === "user"
                      ? "bg-primary/10 ml-8"
                      : "bg-muted mr-4"
                  }`}
                  data-testid={`growth-message-${i}`}
                >
                  {msg.role === "advisor" ? (
                    <div className="space-y-1 whitespace-pre-line">
                      {msg.text.split("\n").map((line, li) => {
                        if (line.startsWith("**") && line.endsWith("**")) {
                          return <p key={li} className="font-semibold text-sm mt-2">{line.replace(/\*\*/g, "")}</p>;
                        }
                        if (line.match(/^\*\*.*\*\*:?/)) {
                          return <p key={li} className="font-semibold text-sm mt-2">{line.replace(/\*\*/g, "")}</p>;
                        }
                        if (line.startsWith("- ")) {
                          return <p key={li} className="text-muted-foreground pl-2">{line}</p>;
                        }
                        if (line.match(/^\d+\./)) {
                          return <p key={li} className="text-muted-foreground">{line.replace(/\*\*/g, "")}</p>;
                        }
                        if (line.trim() === "") return <br key={li} />;
                        return <p key={li} className="text-muted-foreground">{line}</p>;
                      })}
                    </div>
                  ) : (
                    <p>{msg.text}</p>
                  )}
                </div>
              ))}
              {growthLoading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground p-3">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Thinking...
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <Textarea
              placeholder="Ask about courses, certifications, career advice..."
              value={growthInput}
              onChange={(e) => setGrowthInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleGrowthChat(growthInput);
                }
              }}
              className="resize-none text-sm min-h-[40px] max-h-[80px]"
              rows={1}
              data-testid="input-growth-chat"
            />
            <Button
              size="icon"
              onClick={() => handleGrowthChat(growthInput)}
              disabled={growthLoading || !growthInput.trim()}
              data-testid="button-growth-send"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
