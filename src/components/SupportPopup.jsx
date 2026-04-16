import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { showToast } from "@/lib/toast-utils";
import { X, User, MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SupportPopup({ conversation, onClose, onAccept }) {
  if (!conversation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card rounded-2xl shadow-2xl border border-border w-[360px] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 bg-gradient-to-r from-primary to-purple-500 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">New Support Request</p>
                <p className="text-xs text-white/70">Live chat</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold">{conversation.name}</p>
              <p className="text-sm text-muted-foreground">{conversation.email}</p>
            </div>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-3 mb-4">
            <p className="text-sm text-muted-foreground line-clamp-2">{conversation.last_message}</p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>Ignore</Button>
            <Button className="flex-1" onClick={() => onAccept(conversation)}>Accept</Button>
          </div>
        </div>
      </div>
    </div>
  );
}