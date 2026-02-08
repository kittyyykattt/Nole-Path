import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useLocation, useParams } from "wouter";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  DollarSign,
  CheckCircle2,
  XCircle,
  MessageCircle,
  ListChecks,
  Globe,
  Clock,
  FileText,
  UserCircle,
  Mail,
  Copy,
} from "lucide-react";
import { jobs, calculateCompatibility, mentors } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

export default function JobDetail() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const job = jobs.find((j) => j.id === Number(params.id));
  const compat = job ? calculateCompatibility(job) : null;

  if (!job || !compat) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Job not found.</p>
      </div>
    );
  }

  const [showOutreach, setShowOutreach] = useState(false);

  const atsKeywords = [
    ...job.requiredSkills,
    ...job.preferredSkills,
  ];
  const userSkillsLower = ["javascript", "react", "html/css", "python", "git", "sql"];
  const atsFound = atsKeywords.filter((k) =>
    userSkillsLower.includes(k.toLowerCase())
  );
  const atsNotFound = atsKeywords.filter(
    (k) => !userSkillsLower.includes(k.toLowerCase())
  );

  const matchedMentor = useMemo(() => {
    const jobSkills = [...job.requiredSkills, ...job.preferredSkills].map((s) => s.toLowerCase());
    let bestMentor = mentors[0];
    let bestScore = 0;
    for (const mentor of mentors) {
      const score = mentor.tags.filter((t) => jobSkills.some((s) => s.includes(t.toLowerCase()) || t.toLowerCase().includes(s))).length;
      if (score > bestScore) {
        bestScore = score;
        bestMentor = mentor;
      }
    }
    return bestMentor;
  }, [job]);

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/jobs")}
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Jobs
        </Button>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-2xl font-bold" data-testid="text-job-title">
                {job.title}
              </h1>
              <Badge
                variant={job.source === "Nole Network" ? "default" : "secondary"}
                className="no-default-hover-elevate"
              >
                {job.source}
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground">{job.company}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {job.location}
              </span>
              {job.remote && (
                <span className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  Remote
                </span>
              )}
              <span className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                {job.type}
              </span>
              {job.paid && (
                <span className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  Paid
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {job.posted}
              </span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed" data-testid="text-job-description">
                {job.description}
              </p>
              <Separator className="my-4" />
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-2">Required Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {job.requiredSkills.map((skill) => {
                      const matched = userSkillsLower.includes(skill.toLowerCase());
                      return (
                        <Badge
                          key={skill}
                          variant={matched ? "default" : "outline"}
                          className="text-xs no-default-hover-elevate"
                        >
                          {matched && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {!matched && <XCircle className="w-3 h-3 mr-1" />}
                          {skill}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Preferred Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {job.preferredSkills.map((skill) => {
                      const matched = userSkillsLower.includes(skill.toLowerCase());
                      return (
                        <Badge
                          key={skill}
                          variant={matched ? "default" : "outline"}
                          className="text-xs no-default-hover-elevate"
                        >
                          {matched && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {!matched && <XCircle className="w-3 h-3 mr-1" />}
                          {skill}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Compatibility Score</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div
                    className={`text-5xl font-bold ${
                      compat.score >= 70
                        ? "text-green-600 dark:text-green-400"
                        : compat.score >= 50
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                    data-testid="text-compat-score"
                  >
                    {compat.score}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">out of 100</p>
                </div>
                <Progress
                  value={compat.score}
                  className="h-2"
                />

                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">
                      Matched Skills ({compat.matchedSkills.length})
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {compat.matchedSkills.map((s) => (
                        <Badge key={s} variant="secondary" className="text-[10px] py-0 no-default-hover-elevate">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {compat.missingSkills.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-yellow-600 dark:text-yellow-400 mb-1">
                        Missing Skills ({compat.missingSkills.length})
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {compat.missingSkills.map((s) => (
                          <Badge key={s} variant="outline" className="text-[10px] py-0 no-default-hover-elevate">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-mentor">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <UserCircle className="w-4 h-4" />
                  Recommended Mentor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary shrink-0">
                    <UserCircle className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium" data-testid="text-mentor-name">{matchedMentor.name}</p>
                    <p className="text-xs text-muted-foreground">{matchedMentor.role} at {matchedMentor.company}</p>
                    <p className="text-xs text-muted-foreground">FSU Class of {matchedMentor.gradYear}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {matchedMentor.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[10px] py-0 no-default-hover-elevate">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground">{matchedMentor.whyMatched}</p>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setShowOutreach(!showOutreach)}
                  data-testid="button-reach-out"
                >
                  <Mail className="w-3 h-3 mr-2" />
                  {showOutreach ? "Hide Message" : "Reach Out"}
                </Button>

                {showOutreach && (
                  <div className="space-y-2">
                    <div className="p-3 rounded-md border bg-muted/50 text-xs whitespace-pre-line" data-testid="text-outreach-message">
                      {matchedMentor.outreachMessage}
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        navigator.clipboard.writeText(matchedMentor.outreachMessage);
                        toast({ title: "Message copied to clipboard" });
                      }}
                      data-testid="button-copy-outreach"
                    >
                      <Copy className="w-3 h-3 mr-2" />
                      Copy Message
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">ATS Keywords</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">
                    Found ({atsFound.length})
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {atsFound.map((k) => (
                      <Badge key={k} variant="secondary" className="text-[10px] py-0 no-default-hover-elevate">
                        {k}
                      </Badge>
                    ))}
                  </div>
                </div>
                {atsNotFound.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-yellow-600 dark:text-yellow-400 mb-1">
                      Not Found ({atsNotFound.length})
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {atsNotFound.map((k) => (
                        <Badge key={k} variant="outline" className="text-[10px] py-0 no-default-hover-elevate">
                          {k}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Recommended Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {compat.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="flex gap-3 flex-wrap">
          <Button
            onClick={() => navigate(`/coach?job=${job.id}&action=improve`)}
            data-testid="button-improve-match"
          >
            <ListChecks className="w-4 h-4 mr-2" />
            Improve my match
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/resume?job=${job.id}`)}
            data-testid="button-tailor-resume"
          >
            <FileText className="w-4 h-4 mr-2" />
            Tailor my resume
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/coach?job=${job.id}`)}
            data-testid="button-ask-coach"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Ask Coach about this job
          </Button>
        </div>
      </div>
    </div>
  );
}
