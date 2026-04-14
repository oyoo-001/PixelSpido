import { useState, useRef, useEffect } from "react";
import { Clock, Flame, Copy, Check, ChevronDown, ChevronUp, Hash, Play, Pause, Scissors, Save } from "lucide-react";
import PostToSocialButton from "./PostToSocialButton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { api } from "@/lib/api";

const hookLabels = {
  curiosity_gap: "Curiosity Gap",
  problem_solution: "Problem → Solution",
  emotional: "Emotional",
  controversial: "Controversial",
  educational: "Educational",
  storytelling: "Storytelling",
};

const hookColors = {
  curiosity_gap: "bg-primary/10 text-primary",
  problem_solution: "bg-accent/10 text-accent",
  emotional: "bg-chart-4/10 text-chart-4",
  controversial: "bg-destructive/10 text-destructive",
  educational: "bg-chart-5/10 text-chart-5",
  storytelling: "bg-chart-3/10 text-chart-3",
};

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function TimeInput({ label, value, onChange, min, max }) {
  return (
    <div className="flex-1 space-y-1.5">
      <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={min}
          max={max}
          step={0.5}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="flex-1 accent-primary h-1.5 rounded-full cursor-pointer"
        />
        <span className="font-mono text-xs text-foreground w-10 text-right">{formatTime(value)}</span>
      </div>
    </div>
  );
}

export default function SegmentCard({ segment, videoUrl, onStatusChange, onTrimChange }) {
  const [expanded, setExpanded] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [trimStart, setTrimStart] = useState(segment.start_time || 0);
  const [trimEnd, setTrimEnd] = useState(segment.end_time || 0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoDuration, setVideoDuration] = useState(null);
  const [savingTrim, setSavingTrim] = useState(false);
  const videoRef = useRef(null);

  const trimChanged = trimStart !== segment.start_time || trimEnd !== segment.end_time;

  // Seek video to trimStart when trim changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = trimStart;
    }
  }, [trimStart]);

  // Stop at trimEnd during playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.currentTime >= trimEnd) {
        video.pause();
        video.currentTime = trimStart;
        setIsPlaying(false);
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, [trimStart, trimEnd]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.currentTime = trimStart;
      video.play();
      setIsPlaying(true);
    }
  };

  const saveTrim = async () => {
    setSavingTrim(true);
    await api.segments.update(segment.id, {
      start_time: trimStart,
      end_time: trimEnd,
    });
    setSavingTrim(false);
    toast("Trim saved");
    onTrimChange?.(segment.id, trimStart, trimEnd);
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast("Copied to clipboard");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const platformCaptions = [
    { key: "caption_tiktok", label: "TikTok", value: segment.caption_tiktok },
    { key: "caption_instagram", label: "Instagram", value: segment.caption_instagram },
    { key: "caption_linkedin", label: "LinkedIn", value: segment.caption_linkedin },
    { key: "caption_youtube", label: "YouTube", value: segment.caption_youtube },
  ].filter(c => c.value);

  const maxEnd = videoDuration || segment.end_time + 60;

  return (
    <div className={cn(
      "rounded-xl border bg-card overflow-hidden transition-all duration-300",
      segment.status === "approved" ? "border-accent/30" : "border-border",
      segment.status === "rejected" && "opacity-50"
    )}>
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm text-foreground line-clamp-1">{segment.title}</h4>
            <p className="text-xs text-muted-foreground mt-0.5">{segment.headline_overlay}</p>
          </div>
          {segment.viral_score && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-chart-3/10 flex-shrink-0">
              <Flame className="h-3 w-3 text-chart-3" />
              <span className="text-xs font-bold text-chart-3">{segment.viral_score}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">
            <Clock className="h-3 w-3" />
            {formatTime(trimStart)} – {formatTime(trimEnd)} ({Math.round(trimEnd - trimStart)}s)
          </span>
          {segment.hook_type && (
            <span className={cn("px-2 py-0.5 rounded-md text-[10px] font-medium", hookColors[segment.hook_type] || hookColors.educational)}>
              {hookLabels[segment.hook_type] || segment.hook_type}
            </span>
          )}
        </div>
      </div>

      {/* Transcript excerpt */}
      {segment.transcript_excerpt && (
        <div className="px-4 pb-3">
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 italic">
            "{segment.transcript_excerpt}"
          </p>
        </div>
      )}

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-center gap-1 py-2 border-t border-border text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
      >
        {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        {expanded ? "Collapse" : "Preview & Edit Trim / Captions"}
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-border divide-y divide-border">

          {/* Video Player + Trim Section */}
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Scissors className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Trim Clip</span>
            </div>

            {videoUrl ? (
              <>
                {/* Video player */}
                <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    className="w-full h-full object-contain"
                    onLoadedMetadata={(e) => setVideoDuration(e.target.duration)}
                    onEnded={() => setIsPlaying(false)}
                  />
                  <button
                    onClick={togglePlay}
                    className="absolute inset-0 flex items-center justify-center group"
                  >
                    <div className="h-12 w-12 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      {isPlaying
                        ? <Pause className="h-5 w-5 text-white" />
                        : <Play className="h-5 w-5 text-white ml-0.5" />
                      }
                    </div>
                  </button>
                </div>

                {/* Trim sliders */}
                <div className="space-y-3">
                  <TimeInput
                    label="Start"
                    value={trimStart}
                    min={0}
                    max={trimEnd - 0.5}
                    onChange={(v) => setTrimStart(Math.min(v, trimEnd - 0.5))}
                  />
                  <TimeInput
                    label="End"
                    value={trimEnd}
                    min={trimStart + 0.5}
                    max={maxEnd}
                    onChange={(v) => setTrimEnd(Math.max(v, trimStart + 0.5))}
                  />
                </div>

                {/* Duration display */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Duration: <span className="text-foreground font-medium">{Math.round(trimEnd - trimStart)}s</span>
                  </span>
                  {trimChanged && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-7 gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
                      onClick={saveTrim}
                      disabled={savingTrim}
                    >
                      <Save className="h-3 w-3" />
                      {savingTrim ? "Saving…" : "Save Trim"}
                    </Button>
                  )}
                </div>
              </>
            ) : (
              /* No video — show numeric inputs only */
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">No video file attached. Adjust timestamps manually:</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Start (s)", value: trimStart, onChange: setTrimStart },
                    { label: "End (s)", value: trimEnd, onChange: setTrimEnd },
                  ].map(({ label, value, onChange }) => (
                    <div key={label} className="space-y-1">
                      <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{label}</label>
                      <input
                        type="number"
                        min={0}
                        step={0.5}
                        value={value}
                        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                        className="w-full bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm text-foreground font-mono focus:outline-none focus:border-primary/50"
                      />
                    </div>
                  ))}
                </div>
                {trimChanged && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7 gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
                    onClick={saveTrim}
                    disabled={savingTrim}
                  >
                    <Save className="h-3 w-3" />
                    {savingTrim ? "Saving…" : "Save Trim"}
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Captions & Hashtags */}
          <div className="p-4 space-y-4">
            {platformCaptions.map(({ key, label, value }) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
                  <button
                    onClick={() => copyToClipboard(value, key)}
                    className="h-6 w-6 rounded flex items-center justify-center hover:bg-secondary transition-colors"
                  >
                    {copiedField === key ? <Check className="h-3 w-3 text-accent" /> : <Copy className="h-3 w-3 text-muted-foreground" />}
                  </button>
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed">{value}</p>
              </div>
            ))}

            {segment.hashtags?.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <Hash className="h-3 w-3" /> Hashtags
                  </span>
                  <button
                    onClick={() => copyToClipboard(segment.hashtags.map(h => `#${h}`).join(" "), "hashtags")}
                    className="h-6 w-6 rounded flex items-center justify-center hover:bg-secondary transition-colors"
                  >
                    {copiedField === "hashtags" ? <Check className="h-3 w-3 text-accent" /> : <Copy className="h-3 w-3 text-muted-foreground" />}
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {segment.hashtags.map((tag, i) => (
                    <span key={i} className="text-[11px] text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-4 flex items-center gap-2 flex-wrap">
            <Button
              size="sm"
              variant={segment.status === "approved" ? "default" : "outline"}
              className="text-xs h-8"
              onClick={() => onStatusChange(segment.id, segment.status === "approved" ? "pending" : "approved")}
            >
              {segment.status === "approved" ? "✓ Approved" : "Approve"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-xs h-8 text-muted-foreground"
              onClick={() => onStatusChange(segment.id, "rejected")}
            >
              Reject
            </Button>
            <div className="ml-auto">
              <PostToSocialButton segment={segment} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}