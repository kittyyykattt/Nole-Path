import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useLocation, Link } from "wouter";
import {
  LayoutDashboard,
  Briefcase,
  MessageCircle,
  CheckSquare,
  FileText,
  Users,
  Route,
  GraduationCap,
  Mic,
} from "lucide-react";
import { useSession } from "@/components/session-provider";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Jobs", url: "/jobs", icon: Briefcase },
  { title: "Coach", url: "/coach", icon: MessageCircle },
  { title: "Interview", url: "/interview", icon: Mic },
  { title: "Resume", url: "/resume", icon: FileText },
  { title: "Checklist", url: "/checklist", icon: CheckSquare },
  { title: "Mentors", url: "/mentors", icon: Users },
  { title: "Walkthrough", url: "/walkthrough", icon: Route },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { userProfile } = useSession();

  const displayName = userProfile?.name || "Maya Rodriguez";
  const displayMajor = userProfile?.major || "Computer Science";
  const displayYear = userProfile?.year || "Junior";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/dashboard">
          <div className="flex items-center gap-2 cursor-pointer" data-testid="link-logo">
            <div className="flex items-center justify-center w-9 h-9 rounded-md bg-primary">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold leading-tight">Nole Path</span>
              <span className="text-xs text-muted-foreground leading-tight">AI Career Coach</span>
            </div>
          </div>
        </Link>
        <Badge variant="outline" className="mt-3 text-[10px] w-fit no-default-hover-elevate">
          Prototype
        </Badge>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  location === item.url ||
                  (item.url === "/jobs" && location.startsWith("/jobs/"));
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      data-testid={`nav-${item.title.toLowerCase()}`}
                    >
                      <Link href={item.url}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium truncate" data-testid="text-sidebar-name">
              {displayName}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {displayMajor} - {displayYear}
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
