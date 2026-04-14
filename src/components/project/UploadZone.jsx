import { useState, useRef } from "react";
import { Upload, Film, X, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function UploadZone({ onUploadComplete }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    const validTypes = ["video/mp4", "video/quicktime", "video/webm"];
    if (!validTypes.includes(file.type)) {
      return;
    }

    setUploading(true);
    // For now, just use a placeholder URL - in production, upload to storage
    const file_url = URL.createObjectURL(file);
    setUploadedFile({ name: file.name, url: file_url });
    setUploading(false);
    onUploadComplete({ url: file_url, filename: file.name });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const clearFile = () => {
    setUploadedFile(null);
    onUploadComplete(null);
  };

  if (uploadedFile) {
    return (
      <div className="rounded-xl border border-accent/30 bg-accent/5 p-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
            <Film className="h-5 w-5 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{uploadedFile.name}</p>
            <p className="text-xs text-muted-foreground">Ready to process</p>
          </div>
          <button onClick={clearFile} className="h-8 w-8 rounded-lg hover:bg-secondary flex items-center justify-center transition-colors">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => fileInputRef.current?.click()}
      className={cn(
        "rounded-xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-300",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/30 hover:bg-secondary/50"
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/quicktime,video/webm"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />
      {uploading ? (
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <p className="text-sm font-medium text-foreground">Uploading video…</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              Drop your video here or <span className="text-primary">browse</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">MP4, MOV, WebM — up to 500MB</p>
          </div>
        </div>
      )}
    </div>
  );
}