import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@/components/session-provider";
import type { UserProfile } from "@/components/session-provider";
import {
  GraduationCap,
  X,
  Upload,
  ArrowRight,
  Sparkles,
  FileText,
  Target,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";

const demoProfile: UserProfile = {
  name: "Maya Rodriguez",
  email: "maya.rodriguez@fsu.edu",
  major: "Computer Science",
  year: "Junior",
  careerGoals: "Front-End / Full-Stack internships at innovative tech companies",
  careerTrack: "Front-End SWE Intern",
  skills: ["JavaScript", "React", "HTML/CSS", "Python", "Git", "SQL"],
  needsSponsorship: false,
  resumeFilename: "Maya_Rodriguez_Resume.pdf",
  locationPreference: "Florida",
  remotePreference: "Open to both",
};

const suggestedSkills = [
  "JavaScript", "React", "Python", "HTML/CSS", "TypeScript",
  "Node.js", "SQL", "Git", "Java", "C++", "Figma", "AWS",
];

export default function Login() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { login } = useSession();
  const [mode, setMode] = useState<"welcome" | "login" | "questionnaire">("questionnaire");
  const [email, setEmail] = useState("maya.rodriguez@fsu.edu");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState<UserProfile>({ ...demoProfile });
  const [skillInput, setSkillInput] = useState("");

  const handleLogin = () => {
    toast({
      title: "Prototype Login",
      description: "Prototype login: no authentication.",
    });
    setMode("questionnaire");
  };

  const addSkill = (skill: string) => {
    const s = skill.trim();
    if (s && !profile.skills.includes(s)) {
      setProfile((p) => ({ ...p, skills: [...p.skills, s] }));
    }
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    setProfile((p) => ({ ...p, skills: p.skills.filter((s) => s !== skill) }));
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  const handleSubmit = () => {
    if (!profile.name.trim()) {
      toast({ title: "Required", description: "Please enter your name." });
      return;
    }
    login({
      ...profile,
      email: email || "maya@fsu.edu",
    });
    toast({
      title: "Welcome!",
      description: `Profile created for ${profile.name}. Let's get started!`,
    });
    navigate("/dashboard");
  };

  const handleSkipToDemo = () => {
    login({ ...demoProfile });
    toast({
      title: "Demo Mode",
      description: "Loaded Maya Rodriguez demo profile.",
    });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex bg-background">
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
        <div className="relative z-10 flex flex-col justify-center p-12 text-primary-foreground">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-12 h-12 rounded-md bg-primary-foreground/20">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Nole Path</h1>
              <p className="text-sm opacity-80">AI Career Coach</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4 leading-tight">
            Your AI-powered career companion for landing the perfect internship.
          </h2>
          <p className="text-lg opacity-90 mb-6 leading-relaxed">
            Get personalized job matches, resume coaching, interview prep, and mentor connections
            — all tailored to your skills and goals.
          </p>
          <div className="space-y-3">
            {[
              "Skill-based compatibility scoring",
              "AI coaching chatbot with tailored advice",
              "Interview practice with feedback",
              "FSU alumni mentor matching",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm opacity-90">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
          <Badge
            variant="outline"
            className="mt-8 w-fit text-primary-foreground border-primary-foreground/30 no-default-hover-elevate"
          >
            Design Sprint Prototype
          </Badge>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="lg:hidden flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center w-9 h-9 rounded-md bg-primary">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <span className="text-sm font-semibold">Nole Path</span>
              <span className="text-xs text-muted-foreground ml-1">AI Career Coach</span>
            </div>
          </div>

          {mode === "welcome" ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl" data-testid="text-welcome-title">
                  Welcome to Nole Path
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Let's set up your personalized career coaching experience in just a few steps.
                </p>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-3">
                  {[
                    {
                      icon: FileText,
                      title: "Upload Your Resume",
                      description: "We'll analyze your skills and experiences to find the best matches.",
                    },
                    {
                      icon: Target,
                      title: "Set Your Preferences",
                      description: "Tell us your major, career track, and what you're looking for.",
                    },
                    {
                      icon: MessageCircle,
                      title: "Get AI Coaching",
                      description: "Receive personalized job matches, interview prep, and resume tips.",
                    },
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-md border">
                      <div className="flex items-center justify-center w-9 h-9 rounded-md bg-primary/10 shrink-0">
                        <step.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{step.title}</p>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-md bg-primary/5 border border-primary/10">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium">Demo Profile Ready</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    A sample profile (Maya Rodriguez, CS Junior) is pre-loaded so you can explore right away.
                  </p>
                </div>

                <Button
                  className="w-full"
                  onClick={() => setMode("questionnaire")}
                  data-testid="button-start-onboarding"
                >
                  Start Onboarding
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-card px-2 text-muted-foreground">or</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleSkipToDemo}
                  data-testid="button-skip-demo"
                >
                  Skip to Demo
                </Button>
              </CardContent>
            </Card>
          ) : mode === "login" ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl" data-testid="text-login-title">Log In</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Enter your credentials to access Nole Path.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@fsu.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    data-testid="input-email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    data-testid="input-password"
                  />
                </div>
                <Button className="w-full" onClick={handleLogin} data-testid="button-login">
                  Log In
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-card px-2 text-muted-foreground">or</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleSkipToDemo}
                  data-testid="button-demo"
                >
                  Skip to Demo (Maya Rodriguez)
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl" data-testid="text-questionnaire-title">
                  Tell Us About Yourself
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Help us personalize your internship coaching experience.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={profile.name}
                    onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                    data-testid="input-name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="major">Major</Label>
                    <Input
                      id="major"
                      placeholder="e.g. Computer Science"
                      value={profile.major}
                      onChange={(e) => setProfile((p) => ({ ...p, major: e.target.value }))}
                      data-testid="input-major"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Select
                      value={profile.year}
                      onValueChange={(v) => setProfile((p) => ({ ...p, year: v }))}
                    >
                      <SelectTrigger data-testid="select-year">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Freshman">Freshman</SelectItem>
                        <SelectItem value="Sophomore">Sophomore</SelectItem>
                        <SelectItem value="Junior">Junior</SelectItem>
                        <SelectItem value="Senior">Senior</SelectItem>
                        <SelectItem value="Graduate">Graduate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="career-track">Career Track</Label>
                  <Select
                    value={profile.careerTrack}
                    onValueChange={(v) => setProfile((p) => ({ ...p, careerTrack: v }))}
                  >
                    <SelectTrigger data-testid="select-career-track">
                      <SelectValue placeholder="Select focus area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Front-End SWE Intern">Front-End Development</SelectItem>
                      <SelectItem value="Full-Stack Intern">Full-Stack Development</SelectItem>
                      <SelectItem value="Data Science Intern">Data Science / Analytics</SelectItem>
                      <SelectItem value="Cloud/DevOps Intern">Cloud / DevOps</SelectItem>
                      <SelectItem value="UI/UX Engineering Intern">UI/UX Engineering</SelectItem>
                      <SelectItem value="Mobile Development Intern">Mobile Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goals">Career Goals</Label>
                  <Textarea
                    id="goals"
                    placeholder="What kind of internship are you looking for?"
                    value={profile.careerGoals}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, careerGoals: e.target.value }))
                    }
                    className="resize-none"
                    rows={2}
                    data-testid="input-goals"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Skills</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a skill..."
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleSkillKeyDown}
                      data-testid="input-skill"
                    />
                    <Button
                      variant="outline"
                      onClick={() => addSkill(skillInput)}
                      disabled={!skillInput.trim()}
                      data-testid="button-add-skill"
                    >
                      Add
                    </Button>
                  </div>
                  {profile.skills.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap mt-2">
                      {profile.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="gap-1">
                          {skill}
                          <button
                            onClick={() => removeSkill(skill)}
                            className="ml-0.5"
                            data-testid={`button-remove-skill-${skill.toLowerCase().replace(/[\s/]+/g, "-")}`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-1.5 flex-wrap mt-1">
                    {suggestedSkills
                      .filter((s) => !profile.skills.includes(s))
                      .slice(0, 6)
                      .map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="cursor-pointer text-[10px]"
                          onClick={() => addSkill(skill)}
                          data-testid={`badge-suggest-${skill.toLowerCase().replace(/[\s/]+/g, "-")}`}
                        >
                          + {skill}
                        </Badge>
                      ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Need Sponsorship?</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={!profile.needsSponsorship ? "default" : "outline"}
                      size="sm"
                      onClick={() => setProfile((p) => ({ ...p, needsSponsorship: false }))}
                      data-testid="button-sponsorship-no"
                    >
                      No
                    </Button>
                    <Button
                      variant={profile.needsSponsorship ? "default" : "outline"}
                      size="sm"
                      onClick={() => setProfile((p) => ({ ...p, needsSponsorship: true }))}
                      data-testid="button-sponsorship-yes"
                    >
                      Yes
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resume-upload">Resume Upload</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setProfile((p) => ({ ...p, resumeFilename: "My_Resume.pdf" }));
                        toast({
                          title: "Prototype",
                          description: "File upload simulated: My_Resume.pdf",
                        });
                      }}
                      data-testid="button-upload-resume"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      {profile.resumeFilename || "No file selected"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Location Preference</Label>
                    <Select
                      value={profile.locationPreference}
                      onValueChange={(v) =>
                        setProfile((p) => ({ ...p, locationPreference: v }))
                      }
                    >
                      <SelectTrigger data-testid="select-location">
                        <SelectValue placeholder="Any location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Florida">Florida</SelectItem>
                        <SelectItem value="Southeast US">Southeast US</SelectItem>
                        <SelectItem value="Anywhere US">Anywhere US</SelectItem>
                        <SelectItem value="Remote Only">Remote Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Remote Preference</Label>
                    <Select
                      value={profile.remotePreference}
                      onValueChange={(v) =>
                        setProfile((p) => ({ ...p, remotePreference: v }))
                      }
                    >
                      <SelectTrigger data-testid="select-remote">
                        <SelectValue placeholder="No preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Remote Only">Remote Only</SelectItem>
                        <SelectItem value="In-Person Only">In-Person Only</SelectItem>
                        <SelectItem value="Open to both">Open to Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={handleSubmit}
                  data-testid="button-submit-questionnaire"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
