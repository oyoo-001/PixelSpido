import { FileText } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function TranscriptPanel({ transcript }) {
  if (!transcript) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 flex flex-col items-center justify-center h-64">
        <FileText className="h-8 w-8 text-muted-foreground/30 mb-3" />
        <p className="text-sm text-muted-foreground">Transcript will appear here after processing</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <FileText className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Full Transcript</span>
      </div>
      <ScrollArea className="h-96">
        <div className="p-4">
          <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap font-mono text-xs">
            {transcript}
          </p>
        </div>
      </ScrollArea>
    </div>
  );
}