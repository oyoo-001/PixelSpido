import { Upload, FileText, Brain, Sparkles, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { key: "uploading", label: "Upload", icon: Upload },
  { key: "transcribing", label: "Transcribe", icon: FileText },
  { key: "analyzing", label: "AI Analysis", icon: Brain },
  { key: "generating", label: "Generate Clips", icon: Sparkles },
  { key: "ready", label: "Ready", icon: CheckCircle2 },
];

const stepOrder = ["uploading", "transcribing", "analyzing", "generating", "ready"];

export default function ProcessingStatus({ status }) {
  const currentIndex = stepOrder.indexOf(status);

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="text-sm font-semibold text-foreground mb-6">Processing Pipeline</h3>
      <div className="flex items-center justify-between">
        {steps.map((step, i) => {
          const isActive = i === currentIndex;
          const isComplete = i < currentIndex;
          const StepIcon = step.icon;

          return (
            <div key={step.key} className="flex items-center gap-2 flex-1">
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-500",
                  isComplete && "bg-accent/10 text-accent",
                  isActive && "bg-primary/20 text-primary animate-pulse-glow",
                  !isComplete && !isActive && "bg-secondary text-muted-foreground/40"
                )}>
                  <StepIcon className="h-4 w-4" />
                </div>
                <span className={cn(
                  "text-[10px] font-medium transition-colors",
                  isComplete && "text-accent",
                  isActive && "text-primary",
                  !isComplete && !isActive && "text-muted-foreground/40"
                )}>
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={cn(
                  "flex-1 h-px mx-2",
                  i < currentIndex ? "bg-accent/40" : "bg-border"
                )} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}