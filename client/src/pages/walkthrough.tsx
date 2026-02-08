import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  User,
  Globe,
  BarChart3,
  AlertTriangle,
  ListChecks,
  FileText,
  Users,
  CheckCircle2,
} from "lucide-react";
import { walkthroughSteps } from "@/lib/data";

const stepIcons = [
  <User className="w-4 h-4" />,
  <Globe className="w-4 h-4" />,
  <BarChart3 className="w-4 h-4" />,
  <AlertTriangle className="w-4 h-4" />,
  <ListChecks className="w-4 h-4" />,
  <FileText className="w-4 h-4" />,
  <Users className="w-4 h-4" />,
];

export default function Walkthrough() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-walkthrough-title">
            Agent Walkthrough
          </h1>
          <p className="text-sm text-muted-foreground">
            See how the AI agents work together to build your personalized
            internship plan, step by step.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
          <div className="space-y-0">
            {walkthroughSteps.map((step, i) => (
              <div key={i} className="relative pl-14" data-testid={`walkthrough-step-${i}`}>
                <div className="absolute left-3.5 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center z-10">
                  <span className="text-[10px] font-bold">{i + 1}</span>
                </div>
                <Card className="mb-4">
                  <Accordion type="single" collapsible>
                    <AccordionItem value={`step-${i}`} className="border-0">
                      <AccordionTrigger className="px-4 py-3 hover:no-underline">
                        <div className="flex items-center gap-3 text-left">
                          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 shrink-0">
                            {stepIcons[i]}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{step.title}</p>
                            <p className="text-xs text-muted-foreground font-normal">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <div className="p-3 rounded-md bg-card border font-mono text-xs whitespace-pre-wrap leading-relaxed">
                          {step.output}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </Card>
              </div>
            ))}

            <div className="relative pl-14">
              <div className="absolute left-3.5 w-5 h-5 rounded-full bg-green-600 dark:bg-green-500 text-white flex items-center justify-center z-10">
                <CheckCircle2 className="w-3 h-3" />
              </div>
              <Card className="mb-4">
                <CardContent className="p-4">
                  <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                    Plan Complete
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    All agents have finished processing. Your personalized internship
                    plan is ready. Head to the Dashboard to get started!
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
