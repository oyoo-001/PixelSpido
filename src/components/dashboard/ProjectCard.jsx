import { Link } from "react-router-dom";
import { Clock, CheckCircle2, Loader2, AlertCircle, Film, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import moment from "moment";

const statusConfig = {
  uploading: { label: "Uploading", icon: Loader2, color: "text-chart-5", spin: true },
  transcribing: { label: "Transcribing", icon: Loader2, color: "text-chart-3", spin: true },
  analyzing: { label: "AI Analyzing", icon: Loader2, color: "text-primary", spin: true },
  generating: { label: "Generating Clips", icon: Loader2, color: "text-accent", spin: true },
  ready: { label: "Ready", icon: CheckCircle2, color: "text-accent" },
  error: { label: "Error", icon: AlertCircle, color: "text-destructive" },
};

const nicheColors = {
  tech: "bg-chart-5/10 text-chart-5",
  fitness: "bg-accent/10 text-accent",
  finance: "bg-chart-3/10 text-chart-3",
  education: "bg-primary/10 text-primary",
  entertainment: "bg-chart-4/10 text-chart-4",
  lifestyle: "bg-chart-3/10 text-chart-3",
  business: "bg-chart-5/10 text-chart-5",
  health: "bg-accent/10 text-accent",
  other: "bg-muted text-muted-foreground",
};

export default function ProjectCard({ project }) {
  const status = statusConfig[project.status] || statusConfig.error;
  const StatusIcon = status.icon;

  return (
    <Link to={`/project/${project.id}`} className="block group">
      <div className="relative rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Thumbnail area */}
        <div className="relative aspect-video bg-secondary overflow-hidden">
          {project.thumbnail_url ? (
            <img src={project.thumbnail_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Film className="h-10 w-10 text-muted-foreground/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
          
          <div className="absolute top-3 right-3">
            <span className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium backdrop-blur-md bg-background/80 border border-border/50",
              status.color
            )}>
              <StatusIcon className={cn("h-3 w-3", status.spin && "animate-spin")} />
              {status.label}
            </span>
          </div>
          {project.segments_count > 0 && (
            <div className="absolute bottom-3 left-3">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-background/80 backdrop-blur-md border border-border/50 text-foreground">
                {project.segments_count} clips
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="relative p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-1 group-hover:text-primary transition-colors duration-300">
              {project.title}
            </h3>
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0 flex-shrink-0" />
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            {project.niche && (
              <span className={cn("px-2 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wider", nicheColors[project.niche] || nicheColors.other)}>
                {project.niche}
              </span>
            )}
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock className="h-3 w-3" />
              {moment(project.created_date).fromNow()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}