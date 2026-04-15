import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { showToast } from "@/lib/toast-utils";
import { 
  ArrowLeft, Play, Pause, Save, Download, Scissors, Crop, Volume2, 
  Type, Sticker, Music, Loader2, Undo, Redo, ZoomIn, ZoomOut, 
  Split, Trash2, Copy, RotateCw, FlipHorizontal, FlipVertical, Settings,
  Video, Film, MessageSquare, Share2, Download as DownloadIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

const tools = [
  { id: "play", icon: Play, label: "Play" },
  { id: "trim", icon: Crop, label: "Trim" },
  { id: "split", icon: Split, label: "Split" },
  { id: "text", icon: Type, label: "Text" },
  { id: "sticker", icon: Sticker, label: "Sticker" },
  { id: "music", icon: Music, label: "Music" },
  { id: "volume", icon: Volume2, label: "Volume" },
];

export default function VideoEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [segments, setSegments] = useState([]);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(60);
  const [zoom, setZoom] = useState(100);
  const [activeTool, setActiveTool] = useState(null);
  const videoRef = useRef(null);
  const timelineRef = useRef(null);

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      const [projectData, segmentsData] = await Promise.all([
        api.projects.get(id),
        api.segments.list(id, "created_at", 50),
      ]);
      setProject(projectData);
      setSegments(segmentsData || []);
      if (segmentsData?.length > 0) {
        setSelectedSegment(segmentsData[0]);
      }
    } catch (error) {
      showToast(error, "Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.projects.update(id, { status: "editing" });
      showToast({ message: "Project saved" }, "Changes saved successfully");
    } catch (error) {
      showToast(error, "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    try {
      const { download_url } = await api.request(`/projects/${id}/export`, { method: 'POST' });
      window.open(download_url, '_blank');
    } catch (error) {
      showToast(error, "Failed to export");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card/50">
        <div className="flex items-center gap-4">
          <Link to={`/dashboard/projects/${id}`} className="p-2 hover:bg-secondary rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-semibold">{project?.title || 'Untitled Project'}</h1>
            <p className="text-sm text-muted-foreground">
              {segments.length} clips • {formatTime(duration)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save
          </Button>
          <Button size="sm" onClick={handleExport}>
            <DownloadIcon className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Tools Sidebar */}
        <div className="w-16 border-r border-border bg-card/30 flex flex-col items-center py-4 gap-2">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(activeTool === tool.id ? null : tool.id)}
              className={`p-3 rounded-lg transition-colors ${
                activeTool === tool.id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-secondary text-muted-foreground'
              }`}
              title={tool.label}
            >
              <tool.icon className="h-5 w-5" />
            </button>
          ))}
        </div>

        {/* Main Preview Area */}
        <div className="flex-1 flex flex-col">
          {/* Video Preview */}
          <div className="flex-1 bg-black flex items-center justify-center relative">
            {project?.video_url || selectedSegment ? (
              <div className="aspect-video max-w-full max-h-full bg-muted flex items-center justify-center">
                <Video className="h-24 w-24 text-muted-foreground" />
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <Film className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>No video loaded</p>
                <Link to={`/dashboard/projects/${id}`} className="text-primary hover:underline text-sm">
                  Go to project
                </Link>
              </div>
            )}
            
            {/* Playback Controls Overlay */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full p-2">
              <Button size="sm" variant="ghost" className="text-white">
                <Undo className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-white"
                onClick={() => setPlaying(!playing)}
              >
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button size="sm" variant="ghost" className="text-white">
                <Redo className="h-4 w-4" />
              </Button>
              <span className="text-white text-sm ml-2">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div className="h-48 border-t border-border bg-card/30 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={() => setZoom(Math.max(50, zoom - 25))}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-xs text-muted-foreground">{zoom}%</span>
                <Button size="sm" variant="ghost" onClick={() => setZoom(Math.min(200, zoom + 25))}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" title="Add Text">
                  <Type className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" title="Add Sticker">
                  <Sticker className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" title="Add Music">
                  <Music className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Timeline Track */}
            <div 
              ref={timelineRef}
              className="h-24 bg-muted/30 rounded-lg overflow-x-auto overflow-y-hidden"
              style={{ width: `${zoom}%` }}
            >
              <div className="flex gap-1 p-2 min-w-max">
                {segments.map((seg, i) => (
                  <div
                    key={seg.id || i}
                    className={`h-20 w-32 rounded bg-primary/20 border-2 cursor-pointer flex items-center justify-center text-xs truncate ${
                      selectedSegment?.id === seg.id ? 'border-primary' : 'border-transparent'
                    }`}
                    onClick={() => setSelectedSegment(seg)}
                  >
                    {seg.title || `Clip ${i + 1}`}
                  </div>
                ))}
                
                {/* Empty Timeline Slots */}
                {segments.length === 0 && (
                  <div className="h-20 w-full flex items-center justify-center text-muted-foreground text-sm">
                    No clips yet • Add clips from project
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Properties Panel */}
        <div className="w-72 border-l border-border bg-card/30 p-4 overflow-y-auto">
          <h3 className="font-semibold mb-4">Properties</h3>
          
          {selectedSegment ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Clip Name</label>
                <Input 
                  value={selectedSegment.title || ''} 
                  onChange={(e) => setSelectedSegment({ ...selectedSegment, title: e.target.value })}
                  className="mt-1"
                />
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground">Start Time</label>
                <Input 
                  type="number"
                  value={selectedSegment.start_time || 0}
                  onChange={(e) => setSelectedSegment({ ...selectedSegment, start_time: Number(e.target.value) })}
                  className="mt-1"
                />
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground">End Time</label>
                <Input 
                  type="number"
                  value={selectedSegment.end_time || 0}
                  onChange={(e) => setSelectedSegment({ ...selectedSegment, end_time: Number(e.target.value) })}
                  className="mt-1"
                />
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground">Volume</label>
                <Slider 
                  defaultValue={[100]} 
                  max={100} 
                  step={1}
                  className="mt-2"
                />
              </div>
              
              <div className="pt-4 border-t space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  <Split className="h-4 w-4 mr-2" /> Split at Playhead
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Copy className="h-4 w-4 mr-2" /> Duplicate
                </Button>
                <Button variant="destructive" size="sm" className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Scissors className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Select a clip to edit</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}