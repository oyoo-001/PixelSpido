import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { showToast } from "@/lib/toast-utils";
import { Plus, Loader2, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatsCards from "../components/dashboard/StatsCards";
import ProjectCard from "../components/dashboard/ProjectCard";
import EmptyState from "../components/dashboard/EmptyState";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [segments, setSegments] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [projectsData, subData] = await Promise.all([
          api.projects.list("-created_date", 50),
          api.subscription.get(),
        ]);
        setProjects(projectsData);
        setSubscription(subData);
        if (projectsData.length > 0) {
          const allSegments = await Promise.all(
            projectsData.map(p => api.segments.list(p.id, "-created_date", 200))
          );
          setSegments(allSegments.flat());
        }
      } catch (error) {
        showToast(error, "Failed to load dashboard");
        console.error("Dashboard load error:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-8 space-y-8">
      {/* Upgrade Banner for Free Users */}
      {subscription?.plan === 'free' && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500/20 via-primary/10 to-accent/10 border border-primary/30 p-4">
          <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-primary flex items-center justify-center">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Upgrade to Pro</p>
                <p className="text-sm text-muted-foreground">
                  {subscription?.days_remaining > 0 
                    ? `${subscription.days_remaining} days left in free trial` 
                    : "Unlock unlimited projects, AI features, and 4K exports"}
                </p>
              </div>
            </div>
            <Link to="/dashboard/pricing">
              <Button className="gap-2 bg-primary hover:bg-primary/90">
                Upgrade Now
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-card to-card border border-border/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent opacity-60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent opacity-40" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse-glow" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-pulse-glow" style={{ animationDelay: '1s' }} />
        
        <div className="relative px-8 py-12 lg:py-16">
          <div className="flex items-center justify-between flex-col lg:flex-row gap-6">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                AI-Powered Content Engine
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">Mission</span>
                <span className="text-foreground"> Control</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                Transform long-form videos into viral social clips with AI. Upload, analyze, and share — effortless content velocity.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <Link to="/new">
                  <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4" />
                    Create Project
                  </Button>
                </Link>
                {projects.length > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {projects.length} active project{projects.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
            
            <div className="hidden lg:block relative w-48 h-48">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent opacity-20 animate-spin" style={{ animationDuration: '10s' }} />
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-accent to-primary opacity-20 animate-spin" style={{ animationDuration: '7s', animationDirection: 'reverse' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-2xl bg-primary/20 backdrop-blur-xl border border-primary/30 flex items-center justify-center">
                  <Zap className="h-10 w-10 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {projects.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <StatsCards projects={projects} segments={segments} />

          {/* Projects Grid */}
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Recent Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}