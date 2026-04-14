import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import UploadZone from "../components/project/UploadZone";
import { Link } from "react-router-dom";

const niches = [
  { value: "tech", label: "Technology" },
  { value: "fitness", label: "Fitness & Health" },
  { value: "finance", label: "Finance & Investing" },
  { value: "education", label: "Education" },
  { value: "entertainment", label: "Entertainment" },
  { value: "lifestyle", label: "Lifestyle" },
  { value: "business", label: "Business" },
  { value: "health", label: "Healthcare" },
  { value: "other", label: "Other" },
];

const platforms = [
  { value: "tiktok", label: "TikTok" },
  { value: "instagram", label: "Instagram Reels" },
  { value: "youtube", label: "YouTube Shorts" },
  { value: "linkedin", label: "LinkedIn" },
];

export default function NewProject() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [niche, setNiche] = useState("");
  const [targetPlatforms, setTargetPlatforms] = useState(["tiktok", "instagram"]);
  const [uploadData, setUploadData] = useState(null);
  const [processing, setProcessing] = useState(false);

  const togglePlatform = (p) => {
    setTargetPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setProcessing(true);

    const project = await api.projects.create({
      title,
      description,
      niche: niche || "other",
      target_platforms: targetPlatforms,
      status: "transcribing",
      video_url: uploadData?.url || "",
      video_filename: uploadData?.filename || "",
    });

    analyzeWithAI(project);
    navigate(`/project/${project.id}`);
  };

  const analyzeWithAI = async (project) => {
    try {
      await api.projects.update(project.id, { status: "transcribing" });
      
      const { transcript, segments } = await api.request('/ai/analyze', {
        method: 'POST',
        body: JSON.stringify({
          projectId: project.id,
          title,
          description,
          niche: niche || "other",
          targetPlatforms,
        }),
      });
      
      await api.projects.update(project.id, { status: "analyzing", transcript });
      await api.projects.update(project.id, { status: "generating" });
      
      for (const seg of segments || []) {
        await api.segments.create({
          project_id: project.id,
          title: seg.title,
          start_time: seg.start_time_seconds,
          end_time: seg.end_time_seconds,
          transcript_excerpt: seg.transcript_excerpt,
          viral_score: seg.viral_score,
          hook_type: seg.hook_type,
          headline_overlay: seg.headline_overlay,
          caption_tiktok: seg.caption_tiktok,
          caption_instagram: seg.caption_instagram,
          caption_linkedin: seg.caption_linkedin,
          caption_youtube: seg.caption_youtube,
          hashtags: seg.hashtags || [],
          status: "ready",
        });
      }
      
      await api.projects.update(project.id, { status: "ready", segments_count: segments?.length || 0 });
    } catch (error) {
      console.error("AI analysis error:", error);
      await api.projects.update(project.id, { status: "error" });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 lg:p-8">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="space-y-2 mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">New Project</h1>
        <p className="text-sm text-muted-foreground">Upload a video and let AI extract your best clips</p>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Project Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Q4 Marketing Strategy Breakdown"
            className="bg-secondary border-border"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Description <span className="text-muted-foreground font-normal">(optional)</span></Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief context about the video content..."
            rows={3}
            className="bg-secondary border-border resize-none"
          />
        </div>

        {/* Niche */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Content Niche</Label>
          <Select value={niche} onValueChange={setNiche}>
            <SelectTrigger className="bg-secondary border-border">
              <SelectValue placeholder="Select a niche" />
            </SelectTrigger>
            <SelectContent>
              {niches.map((n) => (
                <SelectItem key={n.value} value={n.value}>{n.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Target Platforms */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Target Platforms</Label>
          <div className="flex flex-wrap gap-2">
            {platforms.map((p) => (
              <button
                key={p.value}
                onClick={() => togglePlatform(p.value)}
                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                  targetPlatforms.includes(p.value)
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-secondary border-border text-muted-foreground hover:border-primary/20"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Upload */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Video File <span className="text-muted-foreground font-normal">(optional)</span></Label>
          <UploadZone onUploadComplete={setUploadData} />
        </div>

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          disabled={!title.trim() || processing}
          className="w-full h-12 gap-2 text-sm font-semibold"
        >
          {processing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating Project…
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Create & Analyze
            </>
          )}
        </Button>
      </div>
    </div>
  );
}