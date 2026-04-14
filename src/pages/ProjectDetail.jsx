import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { ArrowLeft, Loader2, Trash2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProcessingStatus from "../components/project/ProcessingStatus";
import TranscriptPanel from "../components/project/TranscriptPanel";
import SegmentCard from "../components/project/SegmentCard";
import { toast } from "sonner";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const [projectData, segmentsData] = await Promise.all([
      api.projects.get(id),
      api.segments.list(id, "-created_date", 20),
    ]);
    setProject(projectData);
    setSegments(segmentsData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  // Poll for status updates while processing
  useEffect(() => {
    if (!project || project.status === "ready" || project.status === "error") return;

    const interval = setInterval(async () => {
      const updated = await api.projects.get(id);
      setProject(updated);
      if (updated.status === "ready") {
        const segs = await api.segments.list(id, "-created_date", 20);
        setSegments(segs);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [project?.status, id]);

  const handleSegmentStatusChange = async (segmentId, newStatus) => {
    await api.segments.update(segmentId, { status: newStatus });
    setSegments((prev) =>
      prev.map((s) => (s.id === segmentId ? { ...s, status: newStatus } : s))
    );
    toast({
      title: newStatus === "approved" ? "Segment approved" : newStatus === "rejected" ? "Segment rejected" : "Status updated",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto p-6 lg:p-8 text-center py-20">
        <p className="text-muted-foreground">Project not found</p>
        <Link to="/" className="text-primary text-sm mt-2 inline-block">Back to Dashboard</Link>
      </div>
    );
  }

  const isProcessing = ["uploading", "transcribing", "analyzing", "generating"].includes(project.status);

  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{project.title}</h1>
            {project.description && (
              <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Processing Status */}
      {isProcessing && <ProcessingStatus status={project.status} />}

      {/* Content area */}
      {project.status === "ready" && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Segments */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                AI-Extracted Segments ({segments.length})
              </h2>
            </div>
            {segments.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-10 text-center">
                <p className="text-sm text-muted-foreground">No segments generated yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {segments.map((seg) => (
                  <SegmentCard
                    key={seg.id}
                    segment={seg}
                    videoUrl={project.video_url}
                    onStatusChange={handleSegmentStatusChange}
                    onTrimChange={(segId, start, end) =>
                      setSegments(prev => prev.map(s => s.id === segId ? { ...s, start_time: start, end_time: end } : s))
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {/* Transcript */}
          <div className="lg:col-span-2">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Transcript</h2>
            <TranscriptPanel transcript={project.transcript} />
          </div>
        </div>
      )}

      {/* Processing waiting state */}
      {isProcessing && (
        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <h3 className="text-sm font-semibold text-foreground mb-1">
            {project.status === "transcribing" && "Transcribing your video…"}
            {project.status === "analyzing" && "AI is analyzing for viral moments…"}
            {project.status === "generating" && "Generating optimized clips…"}
            {project.status === "uploading" && "Processing upload…"}
          </h3>
          <p className="text-xs text-muted-foreground">This may take a minute. The page will update automatically.</p>
        </div>
      )}
    </div>
  );
}