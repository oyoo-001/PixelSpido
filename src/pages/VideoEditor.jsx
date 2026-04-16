import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "@/lib/api";
import { showToast, showSuccess } from "@/lib/toast-utils";
import { 
  Play, Pause, RotateCcw, SkipBack, SkipForward, Volume2, VolumeX,
  Scissors, Crop, Type, Music, Filter, Download, Save, Upload,
  Square, Circle, Triangle, Text, Sticker, Image, Video, Film,
  Settings, Maximize, Minimize, Crop as TrimIcon, Split, Layers,
  Loader2, Plus, X, Check, AlertCircle, Clock, Edit3, Sparkles,
  Search, FileVideo, FolderOpen, Trash2, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const tools = [
  { id: "select", icon: Square, label: "Select" },
  { id: "cut", icon: Scissors, label: "Cut" },
  { id: "trim", icon: TrimIcon, label: "Trim" },
  { id: "text", icon: Type, label: "Text Overlay" },
  { id: "filter", icon: Filter, label: "Filters" },
  { id: "speed", icon: Sparkles, label: "Speed" },
];

const filters = [
  { id: "none", name: "None" },
  { id: "grayscale", name: "Grayscale" },
  { id: "sepia", name: "Sepia" },
  { id: "brightness", name: "Bright" },
  { id: "contrast", name: "Contrast" },
  { id: "blur", name: "Blur" },
];

export default function VideoEditor() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoName, setVideoName] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [zoom, setZoom] = useState(100);
  
  const [activeTool, setActiveTool] = useState(null);
  const [activeFilter, setActiveFilter] = useState("none");
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  
  const [clips, setClips] = useState([]);
  const [selectedClip, setSelectedClip] = useState(null);
  const [textOverlays, setTextOverlays] = useState([]);
  const [newText, setNewText] = useState({ text: "", x: 50, y: 50, size: 24, color: "#ffffff" });
  
  const [projects, setProjects] = useState([]);
  const [showProjects, setShowProjects] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deleting, setDeleting] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { id } = useParams();
  const [view, setView] = useState(id ? "editor" : "projects");

  useEffect(() => {
    if (id) {
      setView("editor");
    }
  }, [id]);

  useEffect(() => {
    loadProjects();
    if (id) {
      loadProject(id);
    }
  }, [id]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume]);

  const loadProjects = async () => {
    try {
      const data = await api.projects.list("created_at", 50);
      setProjects(data || []);
    } catch (error) {
      console.error("Failed to load projects:", error);
    }
  };

  const loadProject = async (projectId) => {
    try {
      const project = await api.projects.get(projectId);
      if (project?.video_url) {
        setVideoUrl(project.video_url);
        setVideoName(project.title);
      }
    } catch (error) {
      console.error("Failed to load project:", error);
    }
  };

  const uploadVideo = async (file) => {
    setSaving(true);
    setUploadProgress(0);
    
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append("video", file);
      formData.append("title", file.name.replace(/\.[^/.]+$/, ""));
      formData.append("status", "editing");

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(percent);
        }
      });

      xhr.addEventListener("load", () => {
        setSaving(false);
        if (xhr.status >= 200 && xhr.status < 300) {
          const res = JSON.parse(xhr.responseText);
          showSuccess("Video uploaded!", "Opening editor...");
          if (res?.id) {
            navigate(`/dashboard/editor/${res.id}`);
          }
          resolve(res);
        } else {
          const error = JSON.parse(xhr.responseText);
          showToast(error, "Failed to upload video");
          reject(error);
        }
      });

      xhr.addEventListener("error", () => {
        setSaving(false);
        showToast({ error: "Upload failed" }, "Failed to upload video");
        reject(new Error("Upload failed"));
      });

      const token = localStorage.getItem("token");
      xhr.open("POST", "/api/projects");
      if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      xhr.send(formData);
    });
  };

  const handleDeleteProject = async (projectId) => {
    setDeleting(projectId);
    try {
      await api.projects.delete(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
      showSuccess("Project deleted");
    } catch (error) {
      showToast(error, "Failed to delete project");
    } finally {
      setDeleting(null);
      setDeleteTarget(null);
    }
  };

  const filteredProjects = projects.filter(p =>
    p.title?.toLowerCase().includes((projectName || "").toLowerCase())
  );

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        showToast({ error: "Invalid file type" }, "Please select a video file");
        return;
      }
      if (file.size > 500 * 1024 * 1024) {
        showToast({ error: "File too large" }, "Video must be less than 500MB");
        return;
      }
      setVideoFile(file);
      setVideoName(file.name.replace(/\.[^/.]+$/, ""));
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
    }
  };

  const handleVideoLoaded = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setCurrentTime(0);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleSeek = (value) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value) => {
    setVolume(value[0]);
    if (videoRef.current) {
      videoRef.current.volume = value[0];
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
    }
  };

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 10);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const addTextOverlay = () => {
    if (newText.text.trim()) {
      setTextOverlays([...textOverlays, { ...newText, id: Date.now() }]);
      setNewText({ text: "", x: 50, y: 50, size: 24, color: "#ffffff" });
    }
  };

  const removeTextOverlay = (id) => {
    setTextOverlays(textOverlays.filter(t => t.id !== id));
  };

  const saveProject = async () => {
    const name = projectName || videoName || "Untitled Project";
    setSaving(true);
    
    try {
      if (id && videoFile) {
        await api.projects.update(id, { title: name, status: "editing" });
        showSuccess("Project Saved!", "Your changes have been saved");
      } else if (videoFile) {
        const formData = new FormData();
        formData.append("video", videoFile);
        formData.append("title", name);
        formData.append("status", "editing");
        
        await api.request("/projects", {
          method: "POST",
          body: formData,
        });
        
        showSuccess("Project Saved!", "Your video project has been saved");
      } else if (id) {
        await api.projects.update(id, { title: name });
        showSuccess("Project Saved!", "Project title updated");
      } else {
        showToast({ error: "No video" }, "Please upload a video first");
      }
    } catch (error) {
      console.error("Save error:", error);
      showToast(error, "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  const openProject = async (project) => {
    if (project.video_url) {
      setVideoUrl(project.video_url);
      setVideoName(project.title);
      setShowProjects(false);
    }
  };

  const applyFilter = (filterId) => {
    setActiveFilter(filterId);
    if (videoRef.current) {
      const video = videoRef.current;
      switch (filterId) {
        case "grayscale":
          video.style.filter = "grayscale(100%)";
          break;
        case "sepia":
          video.style.filter = "sepia(100%)";
          break;
        case "brightness":
          video.style.filter = "brightness(150%)";
          break;
        case "contrast":
          video.style.filter = "contrast(150%)";
          break;
        case "blur":
          video.style.filter = "blur(3px)";
          break;
        default:
          video.style.filter = "none";
      }
    }
  };

  if (showProjects) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">My Projects</h1>
            <Button variant="outline" onClick={() => setShowProjects(false)}>
              <X className="h-4 w-4 mr-2" /> Close
            </Button>
          </div>
          
          {projects.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Film className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p>No projects yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {projects.map(project => (
                <div
                  key={project.id}
                  onClick={() => openProject(project)}
                  className="aspect-video rounded-xl bg-card border border-border overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    {project.thumbnail_url ? (
                      <img src={project.thumbnail_url} alt={project.title} className="w-full h-full object-cover" />
                    ) : (
                      <Film className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80">
                    <p className="text-sm text-white truncate">{project.title}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (view === "projects" || !id) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">Video Editor</h1>
              <p className="text-muted-foreground">Upload and edit your videos</p>
            </div>
            <div className="flex items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={(e) => handleFileSelect(e)}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={saving}
                className="gap-2"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {saving ? `Uploading ${uploadProgress}%` : "Upload Video"}
              </Button>
              {saving && <Progress value={uploadProgress} className="w-48 h-2" />}
            </div>
          </div>

          <div className="relative max-w-md mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="pl-10"
            />
          </div>

          {filteredProjects.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border rounded-xl">
              <FileVideo className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p className="mb-4">No projects yet</p>
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" /> Upload Your First Video
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => navigate(`/dashboard/editor/${project.id}`)}
                  className="group relative aspect-video rounded-xl bg-card border border-border hover:border-primary/50 transition-all overflow-hidden cursor-pointer"
                >
                  <div className="absolute inset-0 bg-muted flex items-center justify-center">
                    {project.thumbnail_url || project.video_url ? (
                      project.thumbnail_url ? (
                        <img
                          src={project.thumbnail_url}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Film className="h-8 w-8 text-muted-foreground" />
                      )
                    ) : (
                      <FolderOpen className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                      <Scissors className="h-5 w-5 text-white" />
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          onClick={(e) => { e.stopPropagation(); setDeleteTarget(project.id); }}
                          disabled={deleting === project.id}
                          className="h-10 w-10 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center"
                        >
                          {deleting === project.id ? (
                            <Loader2 className="h-5 w-5 text-white animate-spin" />
                          ) : (
                            <Trash2 className="h-5 w-5 text-white" />
                          )}
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            Delete Project
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{project.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteProject(project.id)} className="bg-red-500 hover:bg-red-600">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-xs font-medium text-white truncate">
                      {project.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Top Bar */}
      <div className="h-14 bg-[#1a1a1a] border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowProjects(true)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <Film className="h-4 w-4" /> My Projects
          </button>
          <div className="h-4 w-[1px] bg-border" />
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Project name..."
            className="bg-transparent text-sm text-white placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={saveProject} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save
          </Button>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Tools Sidebar */}
        <div className="w-14 bg-[#1a1a1a] border-r border-border flex flex-col items-center py-4 gap-2">
          {tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(activeTool === tool.id ? null : tool.id)}
              className={`p-3 rounded-lg transition-all ${
                activeTool === tool.id 
                  ? 'bg-primary text-white' 
                  : 'text-muted-foreground hover:bg-white/10 hover:text-white'
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
          <div className="flex-1 flex items-center justify-center bg-[#0a0a0a] relative p-8">
            {videoUrl ? (
              <div className="relative max-w-full max-h-full">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  onLoadedMetadata={handleVideoLoaded}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={() => setPlaying(false)}
                  className="max-h-[60vh] rounded-lg"
                />
                {textOverlays.map(overlay => (
                  <div
                    key={overlay.id}
                    className="absolute pointer-events-none"
                    style={{
                      left: `${overlay.x}%`,
                      top: `${overlay.y}%`,
                      fontSize: `${overlay.size}px`,
                      color: overlay.color,
                    }}
                  >
                    {overlay.text}
                  </div>
                ))}
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full max-w-xl aspect-video border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-white/40 transition-colors"
              >
                <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg text-white mb-2">Drop video here or click to upload</p>
                <p className="text-sm text-muted-foreground">MP4, MOV, AVI up to 500MB</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Playback Controls */}
          <div className="h-32 bg-[#1a1a1a] border-t border-border p-4">
            <div className="flex items-center justify-between mb-3">
              {/* Time Display */}
              <div className="text-sm text-white font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
              
              {/* Playback Controls */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={skipBackward}>
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button 
                  size="icon" 
                  className="h-10 w-10 rounded-full bg-white text-black hover:bg-white/90"
                  onClick={togglePlay}
                  disabled={!videoUrl}
                >
                  {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={skipForward}>
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Volume */}
              <div className="flex items-center gap-2 w-32">
                <Button variant="ghost" size="icon" onClick={toggleMute}>
                  {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <Slider
                  value={[volume]}
                  onValueChange={handleVolumeChange}
                  max={1}
                  step={0.1}
                  className="w-20"
                />
              </div>
            </div>
            
            {/* Timeline Scrubber */}
            <Slider
              value={[currentTime]}
              onValueChange={handleSeek}
              max={duration || 100}
              step={0.1}
            />
          </div>
        </div>

        {/* Properties Panel */}
        {activeTool && (
          <div className="w-64 bg-[#1a1a1a] border-l border-border p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white capitalize">{activeTool}</h3>
              <button onClick={() => setActiveTool(null)}>
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {activeTool === "text" && (
              <div className="space-y-3">
                <Input
                  placeholder="Enter text..."
                  value={newText.text}
                  onChange={(e) => setNewText({ ...newText, text: e.target.value })}
                />
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Size"
                    value={newText.size}
                    onChange={(e) => setNewText({ ...newText, size: Number(e.target.value) })}
                    className="w-20"
                  />
                  <Input
                    type="color"
                    value={newText.color}
                    onChange={(e) => setNewText({ ...newText, color: e.target.value })}
                    className="w-12 h-10"
                  />
                </div>
                <Button size="sm" onClick={addTextOverlay} className="w-full">
                  Add Text
                </Button>
                
                {textOverlays.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {textOverlays.map(overlay => (
                      <div key={overlay.id} className="flex items-center justify-between bg-white/10 p-2 rounded">
                        <span className="text-sm truncate">{overlay.text}</span>
                        <button onClick={() => removeTextOverlay(overlay.id)}>
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {activeTool === "filter" && (
              <div className="space-y-2">
                {filters.map(filter => (
                  <Button
                    key={filter.id}
                    variant={activeFilter === filter.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => applyFilter(filter.id)}
                    className="w-full justify-start"
                  >
                    {filter.name}
                  </Button>
                ))}
              </div>
            )}
            
            {activeTool === "speed" && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Playback Speed</p>
                <div className="grid grid-cols-3 gap-2">
                  {[0.5, 1, 1.5, 2].map(speed => (
                    <Button
                      key={speed}
                      variant={playbackSpeed === speed ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setPlaybackSpeed(speed)}
                    >
                      {speed}x
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}