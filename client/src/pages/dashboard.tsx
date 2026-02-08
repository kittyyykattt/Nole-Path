import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLocation, Link } from "wouter";
import {
  RefreshCw,
  Briefcase,
  CheckSquare,
  MessageCircle,
  MapPin,
  Sparkles,
  ArrowRight,
  User,
  FileText,
  Target,
  Globe,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { jobs, calculateCompatibility, initialChecklist } from "@/lib/data";
import { awsApi } from "@/lib/awsApi";
import { useSession } from "@/components/session-provider";

interface AwsMatch {
  job_title?: string;
  title?: string;
  company?: string;
  match_score?: number;
  score?: number;
  match_reasons?: string[];
  reasons?: string[];
  location?: string;
}

export default function Dashboard() {
  const [, navigate] = useLocation();
  const [refreshing, setRefreshing] = useState(false);
  const { userProfile } = useSession();
  const [awsMatches, setAwsMatches] = useState<AwsMatch[] | null>(null);
  const [awsLoading, setAwsLoading] = useState(true);
  const [awsError, setAwsError] = useState<string | null>(null);

  const fetchMatches = useCallback(async () => {
    setAwsLoading(true);
    setAwsError(null);
    try {
      const data = await awsApi.getJobMatches('user_12345');
      const matches: AwsMatch[] = [];
      if (data.top_match) {
        matches.push({
          job_title: data.top_match.title || data.top_match.job_id,
          company: data.top_match.company || "Matched Role",
          match_score: data.top_match.match_score,
          match_reasons: data.top_match.match_reasons || [],
        });
      }
      if (data.matches && Array.isArray(data.matches)) {
        data.matches.forEach((m: any) => {
          matches.push({
            job_title: m.title || m.job_title || m.job_id,
            company: m.company || "Matched Role",
            match_score: m.match_score || m.score,
            match_reasons: m.match_reasons || m.reasons || [],
          });
        });
      }
      if (data.total_matches) {
        setAwsMatches(matches.length > 0 ? matches : null);
        if (matches.length === 0) {
          setAwsError(`AI found ${data.total_matches} matches. Showing local matches.`);
        }
      } else {
        setAwsMatches(matches.length > 0 ? matches : null);
      }
    } catch (err) {
      setAwsError("Couldn't reach AI matching service. Showing local matches.");
      setAwsMatches(null);
    } finally {
      setAwsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMatches().finally(() => {
      setTimeout(() => setRefreshing(false), 800);
    });
  }, [fetchMatches]);

  const localTopJobs = jobs
    .map((job) => ({ job, compat: calculateCompatibility(job) }))
    .sort((a, b) => b.compat.score - a.compat.score)
    .slice(0, 3);

  const completedCount = initialChecklist.filter((c) => c.completed).length;
  const checklistProgress = Math.round(
    (completedCount / initialChecklist.length) * 100
  );
  const todayTasks = initialChecklist.filter((c) => !c.completed).slice(0, 3);

  const firstName = userProfile?.name?.split(" ")[0] || "Maya";
  const focusTrack = userProfile?.careerTrack || "Front-End SWE Intern";

  const useAwsData = awsMatches && awsMatches.length > 0;

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-greeting">
              Hi {firstName}
            </h1>
            <p className="text-sm text-muted-foreground" data-testid="text-focus-track">
              {userProfile?.careerGoals
                ? `Because you want ${focusTrack} roles...`
                : <>Your focus track: <span className="font-medium text-foreground">{focusTrack}</span></>}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            data-testid="button-refresh-jobs"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh Jobs"}
          </Button>
        </div>

        {userProfile && (
          <Card data-testid="card-profile-summary">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <User className="w-4 h-4" />
                Your Profile Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground w-24 shrink-0">Name:</span>
                    <span className="font-medium">{userProfile.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground w-24 shrink-0">Major:</span>
                    <span>{userProfile.major || "Not specified"} {userProfile.year ? `(${userProfile.year})` : ""}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground w-24 shrink-0">Track:</span>
                    <span>{userProfile.careerTrack || "Not specified"}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-muted-foreground w-24 shrink-0">Goals:</span>
                    <span className="text-xs">{userProfile.careerGoals || "Not specified"}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-muted-foreground w-24 shrink-0">Skills:</span>
                    <div className="flex gap-1 flex-wrap">
                      {userProfile.skills.length > 0 ? userProfile.skills.map((s) => (
                        <Badge key={s} variant="secondary" className="text-[10px] py-0 no-default-hover-elevate">{s}</Badge>
                      )) : <span className="text-xs text-muted-foreground">None added</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground w-24 shrink-0">Sponsorship:</span>
                    <span>{userProfile.needsSponsorship ? "Yes" : "No"}</span>
                  </div>
                  {userProfile.resumeFilename && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground w-24 shrink-0">Resume:</span>
                      <div className="flex items-center gap-1">
                        <FileText className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs">{userProfile.resumeFilename}</span>
                      </div>
                    </div>
                  )}
                  {(userProfile.locationPreference || userProfile.remotePreference) && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground w-24 shrink-0">Location:</span>
                      <span className="text-xs">
                        {[userProfile.locationPreference, userProfile.remotePreference].filter(Boolean).join(" / ")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Top Matches
                {useAwsData && (
                  <Badge variant="secondary" className="text-[10px] py-0 no-default-hover-elevate">
                    <Sparkles className="w-3 h-3 mr-1" /> AI-Powered
                  </Badge>
                )}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate("/jobs")} data-testid="link-view-all-jobs">
                View All <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {awsLoading ? (
                <div className="flex items-center justify-center py-8 gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Loading AI matches...</span>
                </div>
              ) : useAwsData ? (
                <>
                  {awsMatches!.slice(0, 3).map((match, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between gap-3 p-3 rounded-md border hover-elevate cursor-pointer"
                      onClick={() => navigate("/jobs")}
                      data-testid={`card-aws-match-${idx}`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{match.job_title || match.title || "Untitled Role"}</p>
                        <p className="text-xs text-muted-foreground">{match.company || "Company"}</p>
                        {(match.match_reasons || match.reasons) && (
                          <div className="flex items-center gap-1 mt-1 flex-wrap">
                            {(match.match_reasons || match.reasons || []).slice(0, 2).map((reason, ri) => (
                              <Badge key={ri} variant="outline" className="text-[10px] py-0 no-default-hover-elevate">
                                {reason}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <div className={`text-lg font-bold ${
                          (match.match_score || match.score || 0) >= 70 ? "text-green-600 dark:text-green-400" :
                          (match.match_score || match.score || 0) >= 50 ? "text-yellow-600 dark:text-yellow-400" :
                          "text-red-600 dark:text-red-400"
                        }`}>
                          {match.match_score || match.score || 0}%
                        </div>
                        <p className="text-[10px] text-muted-foreground">match</p>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {awsError && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2" data-testid="text-aws-fallback">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{awsError}</span>
                    </div>
                  )}
                  {localTopJobs.map(({ job, compat }) => (
                    <Link key={job.id} href={`/jobs/${job.id}`}>
                      <div
                        className="flex items-start justify-between gap-3 p-3 rounded-md border hover-elevate cursor-pointer"
                        data-testid={`card-job-${job.id}`}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">{job.title}</p>
                          <p className="text-xs text-muted-foreground">{job.company}</p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {job.location}
                            </span>
                            <Badge variant={job.source === "Nole Network" ? "default" : "secondary"} className="text-[10px] py-0 no-default-hover-elevate">
                              {job.source}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className={`text-lg font-bold ${compat.score >= 70 ? "text-green-600 dark:text-green-400" : compat.score >= 50 ? "text-yellow-600 dark:text-yellow-400" : "text-red-600 dark:text-red-400"}`}>
                            {compat.score}%
                          </div>
                          <p className="text-[10px] text-muted-foreground">match</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </>
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <CheckSquare className="w-4 h-4" />
                  Today's Checklist
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">
                    {completedCount}/{initialChecklist.length} completed
                  </span>
                  <span className="text-xs font-medium">{checklistProgress}%</span>
                </div>
                <Progress value={checklistProgress} className="h-2" />
                <div className="space-y-2">
                  {todayTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-start gap-2 text-xs"
                      data-testid={`checklist-item-${task.id}`}
                    >
                      <div className="w-4 h-4 rounded border border-muted-foreground/30 shrink-0 mt-0.5" />
                      <span>{task.text}</span>
                    </div>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate("/checklist")}
                  data-testid="link-full-checklist"
                >
                  Full Checklist <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Coach Tip
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground" data-testid="text-coach-tip">
                  Strong React match across your top jobs! Consider adding a
                  TypeScript project to your portfolio this week to boost your
                  scores by 5-10 points.
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => navigate("/coach")}
                  data-testid="link-ask-coach"
                >
                  <MessageCircle className="w-3 h-3 mr-1" /> Ask Coach
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
