import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Mail,
  GraduationCap,
  Building,
  Calendar,
  Copy,
} from "lucide-react";
import { mentors } from "@/lib/data";

export default function Mentors() {
  const { toast } = useToast();
  const [selectedMentor, setSelectedMentor] = useState<number | null>(null);
  const mentor = selectedMentor !== null ? mentors.find((m) => m.id === selectedMentor) : null;

  const copyMessage = () => {
    if (mentor) {
      navigator.clipboard.writeText(mentor.outreachMessage).then(() => {
        toast({ title: "Copied to clipboard", description: "Outreach message copied." });
      });
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-mentors-title">Alumni Mentors</h1>
          <p className="text-sm text-muted-foreground">
            FSU alumni matched to your career goals. Mentor data shown is demo-only.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {mentors.map((m) => {
            const initials = m.name
              .split(" ")
              .map((n) => n[0])
              .join("");
            return (
              <Card key={m.id} className="hover-elevate" data-testid={`card-mentor-${m.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10 shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 space-y-2">
                      <div>
                        <h3 className="font-semibold text-sm">{m.name}</h3>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1">
                            <Building className="w-3 h-3" />
                            {m.role} at {m.company}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Class of {m.gradYear}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {m.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-[10px] py-0 no-default-hover-elevate"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">{m.whyMatched}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedMentor(m.id)}
                        data-testid={`button-outreach-${m.id}`}
                      >
                        <Mail className="w-3 h-3 mr-1" />
                        Draft Outreach Message
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Dialog
          open={selectedMentor !== null}
          onOpenChange={(open) => !open && setSelectedMentor(null)}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Outreach Message for {mentor?.name}</DialogTitle>
              <DialogDescription>
                A personalized message based on your profile and their background. Edit before sending.
              </DialogDescription>
            </DialogHeader>
            <Textarea
              value={mentor?.outreachMessage || ""}
              readOnly
              className="min-h-[200px] text-sm"
              data-testid="textarea-outreach"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedMentor(null)}>
                Close
              </Button>
              <Button onClick={copyMessage} data-testid="button-copy-message">
                <Copy className="w-4 h-4 mr-2" />
                Copy Message
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
