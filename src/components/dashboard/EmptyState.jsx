import { Link } from "react-router-dom";
import { Plus, Zap, Upload, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmptyState() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card via-card to-secondary/30 border border-border/50">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
      
      <div className="relative flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-2xl bg-primary/20 animate-pulse-glow blur-xl" />
          <div className="relative h-24 w-24 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 backdrop-blur-xl border border-primary/30 flex items-center justify-center">
            <Zap className="h-12 w-12 text-primary" />
          </div>
          <div className="absolute -top-2 -right-2">
            <Sparkles className="h-5 w-5 text-accent animate-pulse" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-foreground mb-3">Ready to create magic?</h2>
        <p className="text-sm text-muted-foreground max-w-sm mb-8 leading-relaxed">
          Upload your first long-form video and watch AI extract the most engaging clips for every platform.
        </p>
        
        <Link to="/new">
          <Button size="lg" className="gap-2.5 px-8 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300">
            <Upload className="h-4 w-4" />
            <Plus className="h-4 w-4" />
            Create First Project
          </Button>
        </Link>
      </div>
    </div>
  );
}