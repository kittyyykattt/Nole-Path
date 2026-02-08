import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Code,
  Users,
  Lightbulb,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Plus,
  ChevronRight,
} from "lucide-react";
import { jobs } from "@/lib/data";

interface Question {
  id: number;
  text: string;
  hint: string;
  exampleAnswer: string;
  feedbackBullets: string[];
  suggestedImprovement: string;
}

function generateTechnicalQuestions(jobTitle: string, skills: string[]): Question[] {
  const skillSet = skills.map((s) => s.toLowerCase());
  const questions: Question[] = [];
  let id = 1;

  if (skillSet.some((s) => s.includes("javascript") || s.includes("react"))) {
    questions.push({
      id: id++,
      text: `For the ${jobTitle} role: Explain the difference between \`let\`, \`const\`, and \`var\` in JavaScript. When would you use each?`,
      hint: "Think about scope (block vs function), hoisting behavior, and reassignment rules.",
      exampleAnswer: "`var` is function-scoped, hoisted, and can be redeclared. `let` is block-scoped, not hoisted in the same way, and can be reassigned but not redeclared. `const` is block-scoped and cannot be reassigned after initialization (though objects/arrays it references can still be mutated). Use `const` by default for values that won't change, `let` for loop counters or values that need reassignment, and avoid `var` in modern code.",
      feedbackBullets: [
        "Correctness: Did you mention scope differences (block vs function)?",
        "Edge cases: Did you note that `const` objects are still mutable?",
        "Complexity: Did you explain hoisting behavior?",
        "Tradeoffs: Did you recommend a default usage pattern?",
      ],
      suggestedImprovement: "A strong answer also mentions the Temporal Dead Zone for `let`/`const` and explains why `var` can lead to bugs in loops with closures.",
    });
    questions.push({
      id: id++,
      text: `How does React's Virtual DOM work, and why is it beneficial for a ${jobTitle} position?`,
      hint: "Consider the reconciliation process, diffing algorithm, and performance benefits over direct DOM manipulation.",
      exampleAnswer: "React maintains a lightweight in-memory representation of the actual DOM called the Virtual DOM. When state changes, React creates a new Virtual DOM tree, diffs it against the previous one (reconciliation), and calculates the minimum set of changes needed. It then batches these changes and applies them to the real DOM in a single update. This is beneficial because direct DOM manipulation is expensive, and React's approach minimizes reflows and repaints, leading to better performance in complex UIs.",
      feedbackBullets: [
        "Correctness: Did you explain the diffing/reconciliation process?",
        "Edge cases: Did you mention key props for list rendering?",
        "Complexity: Did you discuss batching and performance?",
        "Tradeoffs: Did you acknowledge any limitations of Virtual DOM?",
      ],
      suggestedImprovement: "Mention React Fiber architecture for concurrent rendering and how keys help React identify which items changed in lists.",
    });
  }

  if (skillSet.some((s) => s.includes("react"))) {
    questions.push({
      id: id++,
      text: "Describe the component lifecycle in React. How do hooks like `useEffect` relate to class component lifecycle methods?",
      hint: "Map useEffect to componentDidMount, componentDidUpdate, and componentWillUnmount.",
      exampleAnswer: "In class components, the lifecycle includes mounting (constructor, render, componentDidMount), updating (shouldComponentUpdate, render, componentDidUpdate), and unmounting (componentWillUnmount). With hooks, `useEffect` with an empty dependency array replaces componentDidMount, `useEffect` with dependencies replaces componentDidUpdate, and the cleanup function returned from `useEffect` replaces componentWillUnmount. Hooks simplify the mental model by colocating related logic rather than splitting it across lifecycle methods.",
      feedbackBullets: [
        "Correctness: Did you map hooks to lifecycle methods accurately?",
        "Edge cases: Did you mention cleanup functions?",
        "Complexity: Did you discuss dependency arrays?",
        "Tradeoffs: Did you explain why hooks are preferred?",
      ],
      suggestedImprovement: "Discuss common pitfalls like missing dependencies causing stale closures, and mention useLayoutEffect for synchronous DOM reads.",
    });
  }

  questions.push({
    id: id++,
    text: `System design: How would you structure a small React application for ${jobTitle.includes("E-Commerce") ? "an e-commerce checkout flow" : "a dashboard with multiple data views"}?`,
    hint: "Think about component hierarchy, state management, data fetching, and routing.",
    exampleAnswer: "I would start with a clear folder structure: pages/ for route-level components, components/ for reusable UI pieces, hooks/ for custom logic, and lib/ for utilities. For state management, I'd use React Context for global state (like user auth) and local useState for component-specific state. Data fetching would use React Query for server state with caching and automatic refetching. Routing would use React Router with lazy loading for code splitting. I'd also set up a design system with consistent spacing, colors, and typography.",
    feedbackBullets: [
      "Correctness: Did you address component organization?",
      "Edge cases: Did you consider loading and error states?",
      "Complexity: Did you mention state management strategy?",
      "Tradeoffs: Did you discuss when to use local vs global state?",
    ],
    suggestedImprovement: "Add discussion of testing strategy (unit tests for utilities, integration tests for key flows) and accessibility considerations.",
  });

  if (skillSet.some((s) => s.includes("async") || s.includes("javascript"))) {
    questions.push({
      id: id++,
      text: "Explain async/await in JavaScript. How does it relate to Promises, and what are common pitfalls?",
      hint: "Think about the event loop, error handling with try/catch, and parallel execution with Promise.all.",
      exampleAnswer: "Async/await is syntactic sugar over Promises that makes asynchronous code read like synchronous code. An `async` function always returns a Promise. `await` pauses execution within the function until the Promise resolves. Common pitfalls include: not handling errors (use try/catch), accidentally running awaits sequentially when they could be parallel (use Promise.all), and forgetting that `await` only works in async functions. The event loop continues processing other tasks while awaiting.",
      feedbackBullets: [
        "Correctness: Did you explain the relationship to Promises?",
        "Edge cases: Did you mention error handling patterns?",
        "Complexity: Did you discuss sequential vs parallel execution?",
        "Tradeoffs: Did you mention when callbacks might still be appropriate?",
      ],
      suggestedImprovement: "Mention Promise.allSettled for handling mixed success/failure cases, and discuss how async/await works with the microtask queue.",
    });
  }

  questions.push({
    id: id++,
    text: "Walk me through a project you've built. What was the architecture, and what would you do differently?",
    hint: "Use the STAR-like format: describe the project, your role, technical decisions, and lessons learned.",
    exampleAnswer: "I built a study group scheduling web app using React and Node.js. The frontend used React with Context API for state management and React Router for navigation. The backend was Express with a PostgreSQL database. I used REST APIs for communication. If I were to rebuild it, I'd use TypeScript for type safety, React Query for data fetching instead of raw fetch calls, and add automated testing. I'd also implement better error boundaries and loading states.",
    feedbackBullets: [
      "Correctness: Did you clearly describe the tech stack and architecture?",
      "Edge cases: Did you mention challenges you encountered?",
      "Complexity: Did you discuss your decision-making process?",
      "Tradeoffs: Did you show growth by identifying improvements?",
    ],
    suggestedImprovement: "Quantify impact where possible (users served, performance improvements). Show how you'd apply lessons learned to the role you're interviewing for.",
  });

  if (skillSet.some((s) => s.includes("python") || s.includes("sql"))) {
    questions.push({
      id: id++,
      text: "Write a function that finds the first duplicate in an array. What is the time and space complexity?",
      hint: "Consider using a Set for O(n) time complexity, or discuss the brute force O(n^2) approach first.",
      exampleAnswer: "Using a Set: iterate through the array, checking if each element is already in the Set. If yes, return it as the first duplicate. If no, add it to the Set. Time: O(n) where n is array length. Space: O(n) for the Set. Alternative: sort first (O(n log n) time, O(1) space if in-place) and check adjacent elements. The Set approach is preferred when space isn't constrained.",
      feedbackBullets: [
        "Correctness: Did your solution handle edge cases (empty array, no duplicates)?",
        "Edge cases: What about arrays with all identical elements?",
        "Complexity: Did you analyze both time and space complexity?",
        "Tradeoffs: Did you discuss multiple approaches?",
      ],
      suggestedImprovement: "Discuss when you'd choose one approach over another based on constraints. Mention that in-place solutions may be preferred in memory-constrained environments.",
    });
  }

  return questions.length > 0 ? questions : [{
    id: 1,
    text: `Describe your approach to debugging a complex issue in a ${jobTitle} project.`,
    hint: "Think about systematic debugging: reproduce, isolate, identify root cause, fix, and verify.",
    exampleAnswer: "I follow a systematic approach: First, reproduce the bug consistently. Then, use browser DevTools or logging to isolate where the issue occurs. I check recent changes that might have introduced the bug. Once I identify the root cause, I write a fix and add a test to prevent regression. Finally, I verify the fix doesn't break other functionality.",
    feedbackBullets: [
      "Correctness: Did you describe a systematic process?",
      "Edge cases: Did you mention using DevTools or debugging tools?",
      "Complexity: Did you discuss preventing regressions?",
      "Tradeoffs: Did you mention when to ask for help vs. debug alone?",
    ],
    suggestedImprovement: "Mention specific tools (Chrome DevTools, React DevTools, console methods) and strategies like rubber duck debugging or binary search through code.",
  }];
}

function generateBehavioralQuestions(jobTitle: string, company: string): Question[] {
  return [
    {
      id: 101,
      text: `Tell me about a time you had a conflict with a teammate while working on a project. How did you resolve it?`,
      hint: "Use the STAR method: Situation, Task, Action, Result. Focus on communication and compromise.",
      exampleAnswer: "Situation: During a group project, a teammate and I disagreed on whether to use REST or GraphQL for our API. Task: We needed to decide quickly to meet our deadline. Action: I suggested we each spend 30 minutes researching pros/cons for our specific use case, then present findings. After comparing, we agreed REST was simpler for our needs. Result: We delivered on time, and the teammate later thanked me for the structured approach to resolving disagreements.",
      feedbackBullets: [
        "Clarity: Did you set up the situation clearly?",
        "Structure: Did you follow the STAR format?",
        "Specificity: Did you provide concrete details, not vague generalities?",
        "STAR format: Was the Result section strong with a clear outcome?",
      ],
      suggestedImprovement: "Quantify the result if possible (delivered 2 days early, received positive feedback from professor/manager). Show what you learned from the experience.",
    },
    {
      id: 102,
      text: `Why are you interested in the ${jobTitle} role at ${company}?`,
      hint: "Research the company's products, culture, and mission. Connect your skills and interests to their specific work.",
      exampleAnswer: `I'm excited about ${company} because of their focus on building innovative products that impact real users. The ${jobTitle} role aligns perfectly with my skills in front-end development and my interest in creating intuitive user experiences. I've followed ${company}'s recent work and I'm particularly drawn to their commitment to code quality and mentoring interns. I see this as an opportunity to grow my technical skills while contributing meaningfully to the team.`,
      feedbackBullets: [
        "Clarity: Did you articulate specific reasons for your interest?",
        "Structure: Did you connect your skills to the role?",
        "Specificity: Did you mention something specific about the company?",
        "STAR format: N/A - This is a motivation question, not behavioral.",
      ],
      suggestedImprovement: "Reference a specific product, feature, or company value. Show you've done your homework beyond the job posting.",
    },
    {
      id: 103,
      text: "Describe a time when you had to learn something quickly to complete a task or project.",
      hint: "Internship-specific: Show you can ramp up fast, seek resources, and deliver under time pressure.",
      exampleAnswer: "Situation: For a class project, I needed to build a REST API in two weeks, but I had only done front-end work before. Task: Deliver a working backend for our team's web app. Action: I dedicated the first 3 days to a Node.js/Express crash course, built a small practice project, then started on the real API. I asked a friend with backend experience to code review my work. Result: I delivered a functional API with 5 endpoints on time, and our project received an A. I continued learning backend development after the class.",
      feedbackBullets: [
        "Clarity: Did you explain what you needed to learn and why?",
        "Structure: Did you follow the STAR format?",
        "Specificity: Did you describe your learning strategy?",
        "STAR format: Did the Result show both the outcome and continued growth?",
      ],
      suggestedImprovement: "Mention specific resources you used (documentation, tutorials, mentors). Show how this learning experience shaped your approach to new technologies.",
    },
    {
      id: 104,
      text: "Tell me about yourself and your journey into software development.",
      hint: "Keep it to 2 minutes. Cover: background, what drew you to tech, key experiences, and what you're looking for now.",
      exampleAnswer: "I'm a junior Computer Science major at Florida State University with a passion for front-end development. I got interested in coding through a web design class in high school, where I built my first website. At FSU, I've deepened my skills in JavaScript and React through coursework and personal projects, including a study group scheduling app. I'm active in Women in CS and have a part-time campus job that's taught me time management. Now I'm looking for an internship where I can apply my front-end skills on real products and learn from experienced engineers.",
      feedbackBullets: [
        "Clarity: Was the narrative easy to follow?",
        "Structure: Did it flow logically from past to present to future?",
        "Specificity: Did you mention concrete experiences and skills?",
        "STAR format: N/A - This is a narrative question.",
      ],
      suggestedImprovement: "Tailor the ending to the specific role. Mention what about this company/team excites you as a natural conclusion.",
    },
    {
      id: 105,
      text: "How do you handle receiving critical feedback on your work?",
      hint: "Show maturity: listen actively, separate feedback from ego, extract actionable items, follow up.",
      exampleAnswer: "Situation: In a code review, a senior student pointed out that my React component had poor separation of concerns and was doing too much. Task: I needed to address the feedback and improve my code. Action: I thanked them for the detailed review, asked clarifying questions about best practices, and refactored the component into three smaller, focused components. Result: The refactored code was easier to test and maintain. I now proactively seek code reviews before submitting work because I've seen how much I learn from them.",
      feedbackBullets: [
        "Clarity: Did you describe the feedback you received?",
        "Structure: Did you follow the STAR format?",
        "Specificity: Did you show what you did with the feedback?",
        "STAR format: Did the Result show growth and changed behavior?",
      ],
      suggestedImprovement: "Emphasize that you view feedback as a growth opportunity. Mention a system you've developed for tracking and acting on feedback.",
    },
    {
      id: 106,
      text: "Describe a situation where you had to prioritize multiple competing deadlines.",
      hint: "Show organizational skills: how you assessed urgency, communicated with stakeholders, and delivered.",
      exampleAnswer: "Situation: During midterms, I had a CS project due, a math exam, and a club event I was organizing all in the same week. Task: I needed to deliver quality work on all three without burning out. Action: I created a priority matrix based on deadlines and impact. I started with the CS project (highest complexity), broke it into daily milestones, studied math in 30-minute focused sessions, and delegated some club tasks to other officers. Result: I completed the project a day early, scored well on the exam, and the club event went smoothly. This experience taught me the value of planning and delegation.",
      feedbackBullets: [
        "Clarity: Did you explain the competing priorities clearly?",
        "Structure: Did you follow the STAR format?",
        "Specificity: Did you describe your prioritization method?",
        "STAR format: Did the Result cover all three items?",
      ],
      suggestedImprovement: "Mention tools you use for organization (calendar blocking, task lists). Show how you communicate proactively when timelines are tight.",
    },
  ];
}

export default function Interview() {
  const { toast } = useToast();
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"technical" | "behavioral">("technical");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [started, setStarted] = useState(false);

  const selectedJob = jobs.find((j) => j.id === Number(selectedJobId));

  const technicalQuestions = useMemo(
    () =>
      selectedJob
        ? generateTechnicalQuestions(selectedJob.title, selectedJob.requiredSkills)
        : [],
    [selectedJob]
  );

  const behavioralQuestions = useMemo(
    () =>
      selectedJob
        ? generateBehavioralQuestions(selectedJob.title, selectedJob.company)
        : [],
    [selectedJob]
  );

  const questions = activeTab === "technical" ? technicalQuestions : behavioralQuestions;
  const currentQuestion = questions[currentQuestionIndex];

  const resetQuestion = () => {
    setAnswer("");
    setShowHint(false);
    setShowExample(false);
    setShowFeedback(false);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
      resetQuestion();
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as "technical" | "behavioral");
    setCurrentQuestionIndex(0);
    resetQuestion();
    setStarted(false);
  };

  const handleJobChange = (val: string) => {
    setSelectedJobId(val);
    setCurrentQuestionIndex(0);
    resetQuestion();
    setStarted(false);
  };

  const addChecklistItem = (text: string) => {
    toast({
      title: "Added to Checklist",
      description: `"${text}" added with Suggested by Coach badge.`,
    });
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-interview-title">
            Interview Practice
          </h1>
          <p className="text-sm text-muted-foreground">
            Practice technical and behavioral questions tailored to your target role.
          </p>
        </div>

        <Card>
          <CardContent className="p-4 space-y-3">
            <label className="text-sm font-medium">Select Job Context</label>
            <Select value={selectedJobId} onValueChange={handleJobChange}>
              <SelectTrigger data-testid="select-job-context">
                <SelectValue placeholder="Choose a job to practice for..." />
              </SelectTrigger>
              <SelectContent>
                {jobs.map((job) => (
                  <SelectItem key={job.id} value={String(job.id)}>
                    {job.title} - {job.company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedJob && (
              <div className="flex items-center gap-2 text-sm" data-testid="text-interview-pack">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="font-medium">
                  Interview Pack for: {selectedJob.title} &ndash; {selectedJob.company}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {selectedJob && (
          <>
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList>
                <TabsTrigger value="technical" data-testid="tab-technical">
                  <Code className="w-4 h-4 mr-1.5" />
                  Technical
                </TabsTrigger>
                <TabsTrigger value="behavioral" data-testid="tab-behavioral">
                  <Users className="w-4 h-4 mr-1.5" />
                  Behavioral
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-4 space-y-4">
                {!started ? (
                  <Card>
                    <CardContent className="p-6 text-center space-y-4">
                      <div className="flex justify-center">
                        {activeTab === "technical" ? (
                          <Code className="w-10 h-10 text-primary" />
                        ) : (
                          <Users className="w-10 h-10 text-primary" />
                        )}
                      </div>
                      <h3 className="text-lg font-semibold">
                        {activeTab === "technical"
                          ? "Technical Questions"
                          : "Behavioral Questions"}
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        {activeTab === "technical"
                          ? `${questions.length} questions covering ${selectedJob.requiredSkills.join(", ")}, system design, and problem-solving.`
                          : `${questions.length} STAR-format questions on teamwork, leadership, motivation, and internship readiness.`}
                      </p>
                      <Button onClick={() => setStarted(true)} data-testid="button-start">
                        Start Practice
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ) : currentQuestion ? (
                  <>
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <Badge variant="secondary" className="no-default-hover-elevate">
                        Question {currentQuestionIndex + 1} of {questions.length}
                      </Badge>
                      <Badge variant="outline" className="no-default-hover-elevate">
                        {activeTab === "technical" ? "Technical" : "Behavioral"}
                      </Badge>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base leading-relaxed" data-testid="text-question">
                          {currentQuestion.text}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Textarea
                          placeholder="Type your answer here..."
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                          className="resize-none"
                          rows={5}
                          data-testid="input-answer"
                        />

                        <div className="flex gap-2 flex-wrap">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowHint(!showHint)}
                            data-testid="button-hint"
                          >
                            <Lightbulb className="w-4 h-4 mr-1.5" />
                            {showHint ? "Hide Hint" : "I'm Stuck"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowExample(!showExample)}
                            data-testid="button-example"
                          >
                            {showExample ? (
                              <EyeOff className="w-4 h-4 mr-1.5" />
                            ) : (
                              <Eye className="w-4 h-4 mr-1.5" />
                            )}
                            {showExample ? "Hide Example" : "Show Strong Example"}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => setShowFeedback(true)}
                            disabled={!answer.trim()}
                            data-testid="button-feedback"
                          >
                            Get Feedback
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>

                        {showHint && (
                          <Card className="bg-accent/30">
                            <CardContent className="p-3">
                              <div className="flex items-start gap-2">
                                <Lightbulb className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                <p className="text-sm" data-testid="text-hint">
                                  {currentQuestion.hint}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {showExample && (
                          <Card className="bg-accent/30">
                            <CardContent className="p-3 space-y-2">
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Strong Example Answer
                              </p>
                              <p className="text-sm leading-relaxed" data-testid="text-example-answer">
                                {currentQuestion.exampleAnswer}
                              </p>
                            </CardContent>
                          </Card>
                        )}
                      </CardContent>
                    </Card>

                    {showFeedback && (
                      <Card data-testid="card-feedback">
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary" />
                            AI Feedback
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            {currentQuestion.feedbackBullets.map((bullet, i) => (
                              <div key={i} className="flex items-start gap-2 text-sm">
                                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                <span>{bullet}</span>
                              </div>
                            ))}
                          </div>
                          <Card className="bg-accent/30">
                            <CardContent className="p-3 space-y-2">
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Suggested Improvement
                              </p>
                              <p className="text-sm leading-relaxed">
                                {currentQuestion.suggestedImprovement}
                              </p>
                            </CardContent>
                          </Card>
                        </CardContent>
                      </Card>
                    )}

                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <p className="text-xs text-muted-foreground">
                        {currentQuestionIndex + 1} / {questions.length}
                      </p>
                      <Button
                        onClick={nextQuestion}
                        disabled={currentQuestionIndex >= questions.length - 1}
                        data-testid="button-next"
                      >
                        Next Question
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </>
                ) : null}
              </TabsContent>
            </Tabs>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Add to Your Checklist</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  "Practice 10 technical interview questions",
                  "Prepare 3 STAR stories",
                  "Schedule a mock interview with Career Center",
                ].map((item) => (
                  <Button
                    key={item}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => addChecklistItem(item)}
                    data-testid={`button-add-checklist-${item.split(" ").slice(0, 3).join("-").toLowerCase()}`}
                  >
                    <Plus className="w-4 h-4 mr-2 shrink-0" />
                    <span className="text-left">{item}</span>
                    <Badge variant="outline" className="ml-auto text-[10px] no-default-hover-elevate shrink-0">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Coach
                    </Badge>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
