import { Upload, FileText, Brain, Sparkles, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

const steps = [
  { key: "uploading", label: "Upload", icon: Upload, message: "Uploading video..." },
  { key: "transcribing", label: "Transcribe", icon: FileText, message: "Transcribing audio..." },
  { key: "analyzing", label: "AI Analysis", icon: Brain, message: "Analyzing content..." },
  { key: "generating", label: "Generate Clips", icon: Sparkles, message: "Generating clips..." },
  { key: "ready", label: "Ready", icon: CheckCircle2, message: "All done!" },
];

const stepOrder = ["uploading", "transcribing", "analyzing", "generating", "ready"];

export default function ProcessingStatus({ status }) {
  const currentIndex = stepOrder.indexOf(status);
  const progress = ((currentIndex) / (steps.length - 1)) * 100;
  const currentStep = steps.find(s => s.key === status) || steps[0];
  const isProcessing = status !== "ready";

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="text-sm font-semibold text-foreground mb-4">Processing Pipeline</h3>
      
      {isProcessing && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">{currentStep.message}</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            This may take a minute. The page will update automatically.
          </p>
        </div>
      )}
      
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