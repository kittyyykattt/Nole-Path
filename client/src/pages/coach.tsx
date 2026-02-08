import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useSearch } from "wouter";
import {
  Send,
  Sparkles,
  User,
  GraduationCap,
  Trash2,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { jobs, coachResponses } from "@/lib/data";
import type { ChatMessage } from "@/lib/data";
import { awsApi } from "@/lib/awsApi";
import { formatCoachingResponse } from "@/lib/formatCoaching";
import { useSession } from "@/components/session-provider";

const quickActions = [
  "Find roles like this",
  "Improve my resume bullet",
  "Build a 2-week plan",
  "Mock interview questions",
];

const defaultResponses: Record<string, string> = {
  ...coachResponses,
};

function buildImproveChecklist(
  job: { title: string; company: string; requiredSkills: string[]; preferredSkills: string[] },
  resumeData: any | null,
  coachData: any | null,
  userSkills: string[]
): string {
  const parts: string[] = [];
  const userSkillsLower = userSkills.map((s) => s.toLowerCase());

  parts.push(`Here's your personalized improvement plan for **${job.title}** at **${job.company}**:\n`);

  const missingRequired = job.requiredSkills.filter(
    (s) => !userSkillsLower.includes(s.toLowerCase())
  );
  const missingPreferred = job.preferredSkills.filter(
    (s) => !userSkillsLower.includes(s.toLowerCase())
  );
  const matchedSkills = [...job.requiredSkills, ...job.preferredSkills].filter(
    (s) => userSkillsLower.includes(s.toLowerCase())
  );

  if (matchedSkills.length > 0) {
    parts.push(`**Your Matching Skills:** ${matchedSkills.join(", ")}\n`);
  }

  if (missingRequired.length > 0 || missingPreferred.length > 0) {
    parts.push("**Skills Gap Checklist:**");
    if (missingRequired.length > 0) {
      parts.push("*Required skills you need:*");
      missingRequired.forEach((s) => {
        parts.push(`- [ ] Learn **${s}** (high priority - required for this role)`);
      });
    }
    if (missingPreferred.length > 0) {
      parts.push("*Preferred skills to boost your score:*");
      missingPreferred.forEach((s) => {
        parts.push(`- [ ] Add **${s}** to your skillset`);
      });
    }
    parts.push("");
  }

  const analysis = resumeData?.analysis || resumeData;
  if (analysis) {
    if (analysis.summary) {
      parts.push(`**Resume Analysis:** ${analysis.summary}\n`);
    }
    if (analysis.improvement_suggestions && analysis.improvement_suggestions.length > 0) {
      parts.push("**Resume Improvements:**");
      analysis.improvement_suggestions.forEach((s: string) => {
        parts.push(`- [ ] ${s}`);
      });
      parts.push("");
    }
    if (analysis.matching_skills && analysis.matching_skills.length > 0) {
      parts.push(`**Resume Strengths:** ${analysis.matching_skills.join(", ")}\n`);
    }
  }

  if (coachData) {
    const plan = coachData.coaching_plan || coachData.plan || coachData;

    const shortTerm = plan.short_term_checklist || coachData.short_term_checklist;
    if (shortTerm && Array.isArray(shortTerm) && shortTerm.length > 0) {
      parts.push("**Short-Term Actions (This Week/Month)**\n");
      shortTerm.forEach((item: any, i: number) => {
        if (typeof item === 'string') {
          parts.push(`${i + 1}. ${item}`);
        } else if (item && typeof item === 'object') {
          parts.push(`${i + 1}. **${item.task || item.action || item.title || 'Action Item'}**`);
          if (item.timeline) parts.push(`   Timeline: ${item.timeline}`);
          if (item.priority) parts.push(`   Priority: ${item.priority}`);
          if (item.why) parts.push(`   Why: ${item.why}`);
        }
        parts.push("");
      });
    }

    const longTerm = plan.long_term_checklist || coachData.long_term_checklist;
    if (longTerm && Array.isArray(longTerm) && longTerm.length > 0) {
      parts.push("**Long-Term Milestones**\n");
      longTerm.forEach((item: any, i: number) => {
        if (typeof item === 'string') {
          parts.push(`${i + 1}. ${item}`);
        } else if (item && typeof item === 'object') {
          const label = item.milestone || item.goal || item.task || item.title || 'Milestone';
          const timeline = item.timeline ? ` (${item.timeline})` : '';
          parts.push(`${i + 1}. **${label}**${timeline}`);
          if (item.steps && Array.isArray(item.steps)) {
            item.steps.forEach((step: string) => {
              parts.push(`   - ${step}`);
            });
          }
          if (item.why_critical) parts.push(`   Why: ${item.why_critical}`);
          if (item.why) parts.push(`   Why: ${item.why}`);
        }
        parts.push("");
      });
    }

    const courses = plan.recommended_fsu_courses || coachData.recommended_fsu_courses;
    if (courses && Array.isArray(courses) && courses.length > 0) {
      parts.push("**Recommended FSU Courses**");
      courses.forEach((course: string) => {
        parts.push(`- ${course}`);
      });
      parts.push("");
    }

    const certs = plan.recommended_certifications || coachData.recommended_certifications;
    if (certs && Array.isArray(certs) && certs.length > 0) {
      parts.push("**Certifications to Pursue**");
      certs.forEach((cert: string) => {
        parts.push(`- ${cert}`);
      });
      parts.push("");
    }

    const internship = plan.internship_strategy || coachData.internship_strategy;
    if (internship && typeof internship === 'object') {
      parts.push("**Internship Strategy**");
      if (internship.target_companies && Array.isArray(internship.target_companies)) {
        parts.push(`Target Companies: ${internship.target_companies.join(", ")}`);
      }
      if (internship.when_to_apply) {
        parts.push(`When to Apply: ${internship.when_to_apply}`);
      }
      if (internship.application_tips && Array.isArray(internship.application_tips)) {
        parts.push("Application Tips:");
        internship.application_tips.forEach((tip: string) => {
          parts.push(`- ${tip}`);
        });
      }
      parts.push("");
    }

    const overallStrategy = plan.overall_strategy || coachData.overall_strategy;
    if (overallStrategy && typeof overallStrategy === 'string') {
      parts.push(`**Overall Strategy:** ${overallStrategy}\n`);
    }

    const response = coachData.response;
    if (response && typeof response === 'string') {
      parts.push(`**Advice:** ${response}\n`);
    }
  }

  if (!resumeData && !coachData) {
    parts.push("**Recommended Action Plan:**");
    if (missingRequired.length > 0) {
      parts.push(`- [ ] Take an online course covering ${missingRequired.slice(0, 2).join(" and ")}`);
      parts.push(`- [ ] Build a portfolio project using ${missingRequired[0]}`);
    }
    if (missingPreferred.length > 0) {
      parts.push(`- [ ] Explore tutorials for ${missingPreferred.slice(0, 2).join(" and ")}`);
    }
    parts.push("- [ ] Tailor your resume to highlight relevant experience for this role");
    parts.push("- [ ] Add quantifiable results to your resume bullet points");
    parts.push("- [ ] Schedule a mock interview at the FSU Career Center");
    parts.push("");

    parts.push("**Long-Term Development:**");
    parts.push("- [ ] Seek a related project or coursework to build domain expertise");
    parts.push("- [ ] Attend FSU career fairs and networking events");
    parts.push("- [ ] Connect with alumni working at " + job.company + " through Nole Network");
    parts.push("");
  }

  parts.push("Would you like me to dive deeper into any of these areas?");

  return parts.join("\n");
}

export default function Coach() {
  const searchStr = useSearch();
  const params = new URLSearchParams(searchStr);
  const jobId = params.get("job");
  const action = params.get("action");
  const contextJob = jobId ? jobs.find((j) => j.id === Number(jobId)) : null;

  const { chatMessages, setChatMessages, clearChat, userProfile } = useSession();

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const initializedRef = useRef(false);
  const improveTriggeredRef = useRef(false);

  const runImproveAnalysis = async () => {
    if (!contextJob || !userProfile) return;

    const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    clearChat();

    const greetMsg: ChatMessage = {
      id: 1,
      role: "coach",
      text: `I'll create a comprehensive improvement plan for the **${contextJob.title}** position at **${contextJob.company}**. Analyzing your resume, identifying skill gaps, and building your action checklist now...`,
      timestamp: now(),
    };
    setChatMessages([greetMsg]);
    setIsTyping(true);

    let resumeData: any = null;
    let coachData: any = null;

    try {
      const [resumeResult, coachResult] = await Promise.allSettled([
        awsApi.tailorResume(
          userProfile.name,
          userProfile.resumeFilename || 'Resume1.pdf',
          contextJob.title.replace(/\s+/g, '_')
        ),
        awsApi.getCareerCoaching(
          'user_12345',
          `I want to improve my match for the ${contextJob.title} position at ${contextJob.company}. My current skills are: ${userProfile.skills.join(", ")}. The job requires: ${contextJob.requiredSkills.join(", ")}. Preferred skills: ${contextJob.preferredSkills.join(", ")}. Give me a detailed action plan with short-term and long-term checklist items including courses, certifications, and experience I should get.`
        ),
      ]);

      if (resumeResult.status === "fulfilled") resumeData = resumeResult.value;
      if (coachResult.status === "fulfilled") coachData = coachResult.value;
    } catch {
    }

    const checklist = buildImproveChecklist(
      contextJob,
      resumeData,
      coachData,
      userProfile.skills
    );

    const checklistMsg: ChatMessage = {
      id: 2,
      role: "coach",
      text: checklist,
      timestamp: now(),
    };
    setChatMessages((prev) => [...prev, checklistMsg]);
    setIsTyping(false);
    initializedRef.current = true;
  };

  useEffect(() => {
    if (action === "improve" && contextJob && !improveTriggeredRef.current) {
      improveTriggeredRef.current = true;
      runImproveAnalysis();
      return;
    }

    if (!initializedRef.current && chatMessages.length === 0) {
      initializedRef.current = true;
      const greeting = contextJob
        ? `I see you're looking at the **${contextJob.title}** position at ${contextJob.company}. This is a great match for your React and JavaScript skills! How can I help you prepare for this opportunity?`
        : `Welcome${userProfile ? `, ${userProfile.name.split(" ")[0]}` : ""}! I'm your AI career coach. I can help you find internships, improve your resume, build a preparation plan, or practice for interviews. What would you like to work on today?`;
      setChatMessages([
        {
          id: 1,
          role: "coach",
          text: greeting,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: chatMessages.length + 1,
      role: "user",
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const matchedKey = Object.keys(defaultResponses).find(
      (key) => text.toLowerCase().includes(key.toLowerCase())
    );

    let responseText: string;

    try {
      const data = await awsApi.getCareerCoaching('user_12345', text.trim());
      responseText = formatCoachingResponse(data);
    } catch {
      responseText = matchedKey
        ? defaultResponses[matchedKey]
        : `That's a great question! Based on your profile${userProfile ? ` as a ${userProfile.careerTrack || "tech"} candidate` : ""}, I'd recommend:\n\n1. **Review your target companies** - Research their tech stacks and recent projects\n2. **Strengthen portfolio projects** - Focus on React with TypeScript\n3. **Visit the Career Center** - Schedule a resume review and mock interview\n4. **Network on Nole Network** - Connect with FSU alumni at your target companies\n\nWould you like me to dive deeper into any of these areas?`;
    }

    const coachMsg: ChatMessage = {
      id: chatMessages.length + 2,
      role: "coach",
      text: responseText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setChatMessages((prev) => [...prev, coachMsg]);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-6 py-2 border-b bg-card">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 text-sm">
            {contextJob ? (
              <>
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Context:</span>
                <span className="font-medium" data-testid="text-job-context">
                  {contextJob.title} at {contextJob.company}
                </span>
                {action === "improve" && (
                  <Badge variant="secondary" className="text-[10px] no-default-hover-elevate">
                    Improve Mode
                  </Badge>
                )}
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground" data-testid="text-session-status">
                  Session Active: Chat saved until logout
                </span>
              </>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              clearChat();
              initializedRef.current = false;
              improveTriggeredRef.current = false;
            }}
            data-testid="button-clear-chat"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            <span className="text-xs">Clear Chat</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <div ref={scrollRef} className="flex-1 overflow-auto p-6">
          <div className="max-w-3xl mx-auto space-y-4">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                data-testid={`message-${msg.id}`}
              >
                <div className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${
                  msg.role === "coach"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}>
                  {msg.role === "coach" ? (
                    <GraduationCap className="w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <div className={`max-w-[80%] ${msg.role === "user" ? "text-right" : ""}`}>
                  <Card className={`p-3 inline-block text-left ${
                    msg.role === "user" ? "bg-primary text-primary-foreground" : ""
                  }`}>
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">
                      {msg.text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/).map((part, i) => {
                        if (part.startsWith("**") && part.endsWith("**")) {
                          return <strong key={i}>{part.slice(2, -2)}</strong>;
                        }
                        if (part.startsWith("*") && part.endsWith("*") && !part.startsWith("**")) {
                          return <em key={i}>{part.slice(1, -1)}</em>;
                        }
                        return part;
                      })}
                    </div>
                  </Card>
                  <p className="text-[10px] text-muted-foreground mt-1 px-1">
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3" data-testid="typing-indicator">
                <div className="flex items-center justify-center w-8 h-8 rounded-full shrink-0 bg-primary text-primary-foreground">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <Card className="p-3 inline-block">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {action === "improve" && chatMessages.length <= 1
                        ? "Analyzing resume & building your improvement plan..."
                        : "Thinking..."}
                    </span>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>

        <div className="border-t p-4 bg-background">
          <div className="max-w-3xl mx-auto space-y-3">
            <div className="flex gap-2 flex-wrap">
              {quickActions.map((qa) => (
                <Button
                  key={qa}
                  variant="outline"
                  size="sm"
                  onClick={() => sendMessage(qa)}
                  disabled={isTyping}
                  data-testid={`button-quick-${qa.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {qa}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <Textarea
                ref={textareaRef}
                placeholder="Ask your coach anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="resize-none min-h-[44px] max-h-[120px]"
                rows={1}
                data-testid="input-chat"
              />
              <Button
                size="icon"
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isTyping}
                data-testid="button-send"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
