import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider, useTheme } from "@/components/theme-provider";
import { SessionProvider, useSession } from "@/components/session-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Moon, Sun, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Jobs from "@/pages/jobs";
import JobDetail from "@/pages/job-detail";
import Coach from "@/pages/coach";
import Checklist from "@/pages/checklist";
import Resume from "@/pages/resume";
import Mentors from "@/pages/mentors";
import Walkthrough from "@/pages/walkthrough";
import Interview from "@/pages/interview";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      data-testid="button-theme-toggle"
    >
      {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
    </Button>
  );
}

function AppHeader() {
  const { toast } = useToast();
  const { logout, userProfile } = useSession();
  const { theme, toggleTheme } = useTheme();
  const [, navigate] = useLocation();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "Session cleared. Redirecting to login.",
    });
    navigate("/login");
  };

  const displayName = userProfile?.name || "Maya Rodriguez";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="flex items-center justify-between gap-2 px-3 py-2 border-b sticky top-0 z-50 bg-primary text-primary-foreground">
      <div className="flex items-center gap-2">
        <SidebarTrigger data-testid="button-sidebar-toggle" className="text-primary-foreground hover:bg-primary-foreground/10" />
        <Badge variant="outline" className="text-[10px] hidden sm:inline-flex no-default-hover-elevate border-primary-foreground/30 text-primary-foreground">
          Prototype
        </Badge>
      </div>
      <div className="flex items-center gap-1">
        <div className="hidden sm:flex items-center gap-2 mr-2">
          <Avatar className="w-7 h-7">
            <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground text-[10px]">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium text-primary-foreground" data-testid="text-header-name">
            {displayName}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          data-testid="button-theme-toggle"
          className="text-primary-foreground hover:bg-primary-foreground/10"
        >
          {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </Button>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              data-testid="button-logout"
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <LogOut className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline text-xs">Logout</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Clear session and log out</TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}

function AppLayout() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <AppHeader />
          <Switch>
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/jobs" component={Jobs} />
            <Route path="/jobs/:id" component={JobDetail} />
            <Route path="/coach" component={Coach} />
            <Route path="/interview" component={Interview} />
            <Route path="/checklist" component={Checklist} />
            <Route path="/resume" component={Resume} />
            <Route path="/mentors" component={Mentors} />
            <Route path="/walkthrough" component={Walkthrough} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    </SidebarProvider>
  );
}

function Router() {
  const [location] = useLocation();
  const { isLoggedIn } = useSession();

  if (location === "/" || location === "/login") {
    if (isLoggedIn) {
      return <Redirect to="/dashboard" />;
    }
    return <Login />;
  }

  if (!isLoggedIn) {
    return <Redirect to="/" />;
  }

  return <AppLayout />;
}

function ToastListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      toast({ title: "Prototype", description: String(detail) });
    };
    window.addEventListener("show-toast", handler);
    return () => window.removeEventListener("show-toast", handler);
  }, [toast]);

  return null;
}

function App() {
  return (
    <ThemeProvider>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <ToastListener />
            <Toaster />
            <Router />
          </TooltipProvider>
        </QueryClientProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}

export default App;
