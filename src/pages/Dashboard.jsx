import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import { showToast } from "@/lib/toast-utils";
import NotificationBanner from "@/components/NotificationBanner";
import {
  Plus,
  Loader2,
  Zap,
  Crown,
  Film,
  Scissors,
  Link2,
  Clock,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  const remMins = mins % 60;
  return `${hrs}h ${remMins}m`;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [segments, setSegments] = useState([]);
  const [socialAccounts, setSocialAccounts] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [projectsData, socialData, subData] = await Promise.all([
          api.projects.list("created_at", 50),
          api.socialAccounts.list(),
          api.subscription.get(),
        ]);
        setProjects(projectsData);
        setSocialAccounts(socialData || []);
        setSubscription(subData);

        if (projectsData.length > 0) {
          const allSegments = await Promise.all(
            projectsData.map((p) => api.segments.list(p.id, "created_at", 200)),
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

  const totalVideos = segments.length;
  const totalDuration = segments.reduce((acc, seg) => {
    return acc + ((seg.end_time || 0) - (seg.start_time || 0));
  }, 0);
  const connectedAccounts = socialAccounts.filter(
    (acc) => acc.connected,
  ).length;
  const recentProjects = projects.slice(0, 4);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-8 space-y-8">
      <NotificationBanner />
      
      {/* Header with Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">
            {getGreeting()}, {user?.name?.split(" ")[0] || "there"}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your content.
          </p>
        </div>
        <Link to="/dashboard/editor">
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Upgrade Banner for Free Users */}
      {subscription?.plan === "free" && (
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

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative overflow-hidden rounded-xl bg-card border border-border p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10">
              <Film className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{projects.length}</p>
              <p className="text-xs text-muted-foreground">Projects</p>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-card border border-border p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-accent/10">
              <Scissors className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalVideos}</p>
              <p className="text-xs text-muted-foreground">Videos Generated</p>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-card border border-border p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-500/10">
              <Link2 className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{connectedAccounts}</p>
              <p className="text-xs text-muted-foreground">
                Accounts Connected
              </p>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-card border border-border p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-orange-500/10">
              <Clock className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {formatDuration(totalDuration)}
              </p>
              <p className="text-xs text-muted-foreground">Total Content</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Projects Preview */}
      {recentProjects.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Projects</h2>
            <Link
              to="/dashboard/editor"
              className="text-sm text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentProjects.map((project) => (
              <Link
                key={project.id}
                to={`/dashboard/project/${project.id}`}
                className="group relative overflow-hidden rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
              >
                <div className="aspect-video bg-muted relative">
                  {project.thumbnail_url ? (
                    <img
                      src={project.thumbnail_url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="h-10 w-10 text-white" />
                  </div>
                </div>
                <div className="p-3">
                  <p className="font-medium truncate text-sm">
                    {project.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(project.created_at).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-card to-card border border-border p-8 lg:p-12 text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          <div className="relative">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/20 mb-4">
              <Zap className="h-7 w-7 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome to PixelSpido</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Transform long-form videos into viral social clips with AI. Upload
              your first video and let AI do the heavy lifting.
            </p>
            <Link to="/dashboard/new">
              <Button
                size="lg"
                className="gap-2 bg-primary hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                Create Your First Project
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
