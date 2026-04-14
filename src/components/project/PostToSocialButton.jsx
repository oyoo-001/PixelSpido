import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Send, Loader2, CheckCircle2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const PLATFORM_META = {
  tiktok: { label: "TikTok", icon: "🎵" },
  instagram: { label: "Instagram", icon: "📷" },
  youtube: { label: "YouTube Shorts", icon: "▶️" },
  linkedin: { label: "LinkedIn", icon: "💼" },
};

export default function PostToSocialButton({ segment }) {
  const [accounts, setAccounts] = useState([]);
  const [posting, setPosting] = useState(null);
  const [posted, setPosted] = useState([]);

  useEffect(() => {
    api.socialAccounts.list().then(setAccounts);
  }, []);

  const handlePost = async (account) => {
    setPosting(account.platform);
    const caption = segment[`caption_${account.platform}`] || segment.caption_tiktok || segment.title;
    const hashtags = (segment.hashtags || []).map(h => `#${h}`).join(" ");

    // Simulate posting (in production, integrate with platform APIs)
    await new Promise(resolve => setTimeout(resolve, 1500));

    setPosted(prev => [...prev, account.platform]);
    setPosting(null);
    toast(`Posted to ${PLATFORM_META[account.platform]?.label || account.platform}!`);
  };

  if (accounts.length === 0) {
    return (
      <Link to="/social">
        <Button size="sm" variant="outline" className="text-xs h-8 gap-1.5 text-muted-foreground">
          <ExternalLink className="h-3 w-3" />
          Connect Socials
        </Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline" className="text-xs h-8 gap-1.5 border-primary/30 text-primary hover:bg-primary/10" disabled={!!posting}>
          {posting
            ? <Loader2 className="h-3 w-3 animate-spin" />
            : <Send className="h-3 w-3" />
          }
          {posting ? "Posting…" : "Post To…"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Connected Accounts</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {accounts.map((account) => {
          const meta = PLATFORM_META[account.platform] || {};
          const isPosted = posted.includes(account.platform);
          return (
            <DropdownMenuItem
              key={account.id}
              onClick={() => !isPosted && handlePost(account)}
              className="text-sm gap-2 cursor-pointer"
            >
              <span>{meta.icon}</span>
              <span className="flex-1">{meta.label}</span>
              {isPosted && <CheckCircle2 className="h-3.5 w-3.5 text-accent" />}
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <Link to="/social">
          <DropdownMenuItem className="text-xs text-muted-foreground cursor-pointer">
            <ExternalLink className="h-3 w-3 mr-2" /> Manage accounts
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}