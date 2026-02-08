import { useState, useMemo, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Sparkles,
  Code,
  FileText,
  Users,
  Briefcase,
  MessageCircle,
  RefreshCw,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { initialChecklist } from "@/lib/data";
import type { ChecklistItem } from "@/lib/data";
import { awsApi } from "@/lib/awsApi";

const categoryIcons: Record<string, React.ReactNode> = {
  Skills: <Code className="w-4 h-4" />,
  Resume: <FileText className="w-4 h-4" />,
  Networking: <Users className="w-4 h-4" />,
  Applications: <Briefcase className="w-4 h-4" />,
  "Interview Prep": <MessageCircle className="w-4 h-4" />,
};

const categories = ["All", "Skills", "Resume", "Networking", "Applications", "Interview Prep"];

function mapCategoryLabel(cat: string): ChecklistItem["category"] {
  const lower = cat.toLowerCase();
  if (lower.includes("skill") || lower.includes("learn") || lower.includes("technical")) return "Skills";
  if (lower.includes("resume") || lower.includes("cv") || lower.includes("portfolio")) return "Resume";
  if (lower.includes("network") || lower.includes("mentor") || lower.includes("connect") || lower.includes("alumni")) return "Networking";
  if (lower.includes("applic") || lower.includes("apply") || lower.includes("job")) return "Applications";
  if (lower.includes("interview") || lower.includes("practice") || lower.includes("prep")) return "Interview Prep";
  return "Skills";
}

export default function Checklist() {
  const { toast } = useToast();
  const [items, setItems] = useState<ChecklistItem[]>(() => {
    try {
      const saved = localStorage.getItem("nole-checklist");
      if (saved) return JSON.parse(saved);
    } catch {}
    return [...initialChecklist];
  });
  const [activeTab, setActiveTab] = useState("All");
  const [awsLoading, setAwsLoading] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("nole-checklist", JSON.stringify(items));
    } catch {}
  }, [items]);

  const fetchCoachingChecklist = useCallback(async () => {
    setAwsLoading(true);
    try {
      const data = await awsApi.getCareerCoaching('user_12345');
      const newItems: ChecklistItem[] = [];
      let nextId = 100;

      const shortTerm = data.short_term_checklist || data.shortTermChecklist || [];
      const longTerm = data.long_term_checklist || data.longTermChecklist || [];

      if (Array.isArray(shortTerm)) {
        shortTerm.forEach((item: string) => {
          newItems.push({
            id: nextId++,
            text: item,
            category: mapCategoryLabel(item),
            completed: false,
            suggestedByCoach: true,
          });
        });
      }

      if (Array.isArray(longTerm)) {
        longTerm.forEach((item: string) => {
          newItems.push({
            id: nextId++,
            text: item,
            category: mapCategoryLabel(item),
            completed: false,
            suggestedByCoach: true,
          });
        });
      }

      if (newItems.length > 0) {
        setItems((prev) => {
          const existingTexts = new Set(prev.map((i) => i.text.toLowerCase()));
          const unique = newItems.filter((ni) => !existingTexts.has(ni.text.toLowerCase()));
          if (unique.length === 0) {
            toast({ title: "Up to date", description: "No new items from AI Coach." });
            return prev;
          }
          toast({ title: "Checklist updated", description: `Added ${unique.length} new items from AI Coach.` });
          return [...prev, ...unique];
        });
      } else {
        toast({ title: "No new items", description: "AI Coach didn't return additional checklist items." });
      }
    } catch {
      toast({ title: "Connection issue", description: "Couldn't reach AI Coach. Showing saved items.", variant: "destructive" });
    } finally {
      setAwsLoading(false);
    }
  }, [toast]);

  const toggleItem = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const filteredItems = useMemo(() => {
    if (activeTab === "All") return items;
    return items.filter((item) => item.category === activeTab);
  }, [items, activeTab]);

  const completedCount = items.filter((c) => c.completed).length;
  const totalCount = items.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  const categoryStats = useMemo(() => {
    const cats = ["Skills", "Resume", "Networking", "Applications", "Interview Prep"];
    return cats.map((cat) => {
      const catItems = items.filter((i) => i.category === cat);
      const done = catItems.filter((i) => i.completed).length;
      return { category: cat, total: catItems.length, done, pct: catItems.length ? Math.round((done / catItems.length) * 100) : 0 };
    });
  }, [items]);

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-checklist-title">Checklist</h1>
            <p className="text-sm text-muted-foreground">
              {completedCount} of {totalCount} tasks completed
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              onClick={fetchCoachingChecklist}
              disabled={awsLoading}
              data-testid="button-refresh-coach"
            >
              {awsLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              {awsLoading ? "Loading..." : "Refresh from AI Coach"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                toast({
                  title: "Prototype feature",
                  description: "Adding custom items is available in the full version.",
                });
              }}
              data-testid="button-add-item"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4 mb-3">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm font-bold" data-testid="text-progress-pct">{progressPct}%</span>
            </div>
            <Progress value={progressPct} className="h-3" />
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {categoryStats.map((cs) => (
            <Card
              key={cs.category}
              className="hover-elevate cursor-pointer"
              onClick={() => setActiveTab(cs.category)}
              data-testid={`card-category-${cs.category.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <CardContent className="p-3 text-center space-y-1">
                <div className="flex items-center justify-center text-muted-foreground">
                  {categoryIcons[cs.category]}
                </div>
                <p className="text-xs font-medium truncate">{cs.category}</p>
                <p className="text-lg font-bold">{cs.pct}%</p>
                <p className="text-[10px] text-muted-foreground">
                  {cs.done}/{cs.total}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto gap-1 bg-transparent p-0">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                data-testid={`tab-${cat.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={activeTab} className="mt-4">
            <div className="space-y-2">
              {filteredItems.map((item) => (
                <Card key={item.id} data-testid={`checklist-item-${item.id}`}>
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={item.completed}
                        onCheckedChange={() => toggleItem(item.id)}
                        className="mt-0.5"
                        data-testid={`checkbox-item-${item.id}`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${item.completed ? "line-through text-muted-foreground" : ""}`}>
                          {item.text}
                        </p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <Badge variant="secondary" className="text-[10px] py-0 no-default-hover-elevate">
                            {item.category}
                          </Badge>
                          {item.suggestedByCoach && (
                            <Badge variant="outline" className="text-[10px] py-0 no-default-hover-elevate">
                              <Sparkles className="w-3 h-3 mr-1" />
                              Suggested by Coach
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredItems.length === 0 && (
                <Card className="p-8">
                  <p className="text-center text-muted-foreground text-sm">
                    No items in this category.
                  </p>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
