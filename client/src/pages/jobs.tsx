import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocation, Link } from "wouter";
import {
  Search,
  MapPin,
  RefreshCw,
  Briefcase,
  DollarSign,
} from "lucide-react";
import { jobs, altJobs, calculateCompatibility } from "@/lib/data";
import type { Job } from "@/lib/data";

export default function Jobs() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [paidOnly, setPaidOnly] = useState(false);
  const [sourceFilter, setSourceFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [useAlt, setUseAlt] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setUseAlt((prev) => !prev);
      setRefreshing(false);
    }, 2000);
  };

  const currentJobs = useAlt ? altJobs : jobs;

  const locations = useMemo(() => {
    const locs = new Set(currentJobs.map((j) => j.location));
    return Array.from(locs).sort();
  }, [currentJobs]);

  const filteredJobs = useMemo(() => {
    return currentJobs
      .filter((job) => {
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          if (
            !job.title.toLowerCase().includes(q) &&
            !job.company.toLowerCase().includes(q)
          )
            return false;
        }
        if (locationFilter !== "all" && job.location !== locationFilter)
          return false;
        if (remoteOnly && !job.remote) return false;
        if (paidOnly && !job.paid) return false;
        if (sourceFilter !== "all" && job.source !== sourceFilter) return false;
        return true;
      })
      .map((job) => ({ job, compat: calculateCompatibility(job) }))
      .sort((a, b) => b.compat.score - a.compat.score);
  }, [currentJobs, searchQuery, locationFilter, remoteOnly, paidOnly, sourceFilter]);

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-jobs-title">Jobs Feed</h1>
            <p className="text-sm text-muted-foreground">
              {filteredJobs.length} internships found
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            data-testid="button-refresh-jobs"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Scraping..." : "Refresh Jobs"}
          </Button>
        </div>

        <div className="flex items-end gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              data-testid="input-search"
            />
          </div>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-[180px]" data-testid="select-location">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>{loc}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-[160px]" data-testid="select-source">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="Web">Web</SelectItem>
              <SelectItem value="Nole Network">Nole Network</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox
                checked={remoteOnly}
                onCheckedChange={(c) => setRemoteOnly(!!c)}
                data-testid="checkbox-remote"
              />
              Remote
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox
                checked={paidOnly}
                onCheckedChange={(c) => setPaidOnly(!!c)}
                data-testid="checkbox-paid"
              />
              Paid
            </label>
          </div>
        </div>

        {refreshing && (
          <Card className="p-8">
            <div className="flex flex-col items-center gap-3">
              <RefreshCw className="w-8 h-8 animate-spin text-primary" />
              <div className="text-center">
                <p className="font-medium text-sm">Scraping job sources...</p>
                <p className="text-xs text-muted-foreground">
                  Checking Web sources and Nole Network
                </p>
              </div>
            </div>
          </Card>
        )}

        {!refreshing && (
          <div className="space-y-3">
            {filteredJobs.map(({ job, compat }) => (
              <Link key={job.id} href={`/jobs/${job.id}`}>
                <Card
                  className="hover-elevate cursor-pointer"
                  data-testid={`card-job-${job.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-sm">{job.title}</h3>
                          <Badge
                            variant={job.source === "Nole Network" ? "default" : "secondary"}
                            className="text-[10px] py-0 no-default-hover-elevate"
                          >
                            {job.source}
                          </Badge>
                          {job.remote && (
                            <Badge variant="outline" className="text-[10px] py-0 no-default-hover-elevate">
                              Remote
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{job.company}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3" />
                            {job.type}
                          </span>
                          {job.paid && (
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              Paid
                            </span>
                          )}
                          <span>{job.posted}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {compat.matchedSkills.length > 0 && (
                            <span className="text-green-600 dark:text-green-400">
                              Strong {compat.matchedSkills.slice(0, 2).join(", ")} match
                            </span>
                          )}
                          {compat.missingSkills.length > 0 && (
                            <span>
                              {compat.matchedSkills.length > 0 && "; "}
                              <span className="text-yellow-600 dark:text-yellow-400">
                                missing {compat.missingSkills.slice(0, 2).join(", ")}
                              </span>
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <div
                          className={`text-2xl font-bold ${
                            compat.score >= 70
                              ? "text-green-600 dark:text-green-400"
                              : compat.score >= 50
                              ? "text-yellow-600 dark:text-yellow-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                          data-testid={`score-job-${job.id}`}
                        >
                          {compat.score}
                        </div>
                        <p className="text-[10px] text-muted-foreground">compatibility</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
            {filteredJobs.length === 0 && (
              <Card className="p-8">
                <p className="text-center text-muted-foreground text-sm">
                  No jobs match your filters. Try adjusting your search criteria.
                </p>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
