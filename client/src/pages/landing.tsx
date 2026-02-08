import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { GraduationCap, Briefcase, MessageCircle, Search, ArrowRight, Sparkles, Target, BookOpen } from "lucide-react";

export default function Landing() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between gap-4 flex-wrap px-6 py-4 border-b">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-9 h-9 rounded-md bg-primary">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg" data-testid="text-logo">Nole Path</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/login")}
          data-testid="button-login"
        >
          Login
        </Button>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 no-default-hover-elevate">
            Design Sprint Prototype (static data)
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4" data-testid="text-hero-title">
            Find internships faster with
            <span className="text-primary"> AI coaching</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8" data-testid="text-hero-subtitle">
            Skill matching, a unified job feed, and personalized coaching
            designed for Florida State University students.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/login")}
            data-testid="button-enter-prototype"
          >
            Enter Prototype
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="p-6 hover-elevate">
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10 mb-4">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold mb-2" data-testid="text-feature-1">Skill Matching Agent</h3>
            <p className="text-sm text-muted-foreground">
              Compares your profile and resume to jobs and returns a
              compatibility score with a detailed breakdown of matched and
              missing skills.
            </p>
          </Card>
          <Card className="p-6 hover-elevate">
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10 mb-4">
              <MessageCircle className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold mb-2" data-testid="text-feature-2">Coaching Agent</h3>
            <p className="text-sm text-muted-foreground">
              Interactive AI chatbot that helps you find internships, improve
              resume bullets, build learning plans, and prepare for interviews.
            </p>
          </Card>
          <Card className="p-6 hover-elevate">
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10 mb-4">
              <Search className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold mb-2" data-testid="text-feature-3">Job Scraper Agent</h3>
            <p className="text-sm text-muted-foreground">
              Aggregates internships from web sources and Nole Network into one
              unified feed with smart filtering and ranking.
            </p>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <Briefcase className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium">Career Center Integration</p>
              <p className="text-xs text-muted-foreground">
                Advising, mock interviews, resume reviews
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium">ATS Optimization</p>
              <p className="text-xs text-muted-foreground">
                Keyword analysis and resume tailoring
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium">Alumni Network</p>
              <p className="text-xs text-muted-foreground">
                Mentor matching and outreach drafts
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
