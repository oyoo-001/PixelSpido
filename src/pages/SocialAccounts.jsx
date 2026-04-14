import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const PLATFORMS = [
  {
    key: "facebook",
    label: "Facebook",
    color: "text-white",
    bg: "bg-[#1877f2]",
    hover: "hover:bg-[#1877f2]/90",
  },
  {
    key: "instagram",
    label: "Instagram",
    color: "text-white",
    bg: "bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045]",
    hover: "hover:opacity-90",
  },
  {
    key: "tiktok",
    label: "TikTok",
    color: "text-white",
    bg: "bg-[#fe2c55]",
    hover: "hover:bg-[#fe2c55]/90",
  },
  {
    key: "youtube",
    label: "YouTube",
    color: "text-white",
    bg: "bg-[#ff0000]",
    hover: "hover:bg-[#ff0000]/90",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    color: "text-white",
    bg: "bg-[#0077b5]",
    hover: "hover:bg-[#0077b5]/90",
  },
];

function PlatformCard({ platform, connected, onConnect }) {
  const isConnecting = platform.key === 'connecting';

  return (
    <button
      onClick={() => !connected && onConnect(platform.key)}
      disabled={connected || isConnecting}
      className={`relative overflow-hidden rounded-2xl ${platform.bg} ${platform.hover} transition-all duration-300 group hover:scale-[1.02] hover:shadow-2xl disabled:cursor-not-allowed disabled:hover:scale-100`}
    >
      <div className="p-8 flex flex-col items-center justify-center space-y-4">
        {isConnecting ? (
          <Loader2 className="h-10 w-10 text-white animate-spin" />
        ) : (
          <>
            <h3 className="text-xl font-bold text-white">{platform.label}</h3>
            <p className={`text-sm text-white opacity-80`}>
              {connected ? "Connected" : "Click to connect"}
            </p>
            {connected && (
              <div className="absolute top-4 right-4">
                <Check className="h-6 w-6 text-white" />
              </div>
            )}
          </>
        )}
      </div>
    </button>
  );
}

export default function SocialAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connectingPlatform, setConnectingPlatform] = useState(null);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    const data = await api.socialAccounts.list();
    setAccounts(data);
  };

  const handleConnect = async (platform) => {
    setConnectingPlatform(platform);
    
    try {
      // Get OAuth URL from backend
      const { authUrl } = await api.request(`/social-accounts/oauth-url/${platform}`);
      
      // Open popup
      const popup = window.open(authUrl, `${platform} Connect`, 'width=500,height=600');
      
      // Listen for callback
      const checkClosed = setInterval(async () => {
        if (popup.closed) {
          clearInterval(checkClosed);
          setConnectingPlatform(null);
          await loadAccounts();
        }
      }, 1000);
    } catch (error) {
      console.error("Connect error:", error);
      toast.error(error.error || `Failed to connect ${platform}`);
      setConnectingPlatform(null);
    }
  };

  const handleDisconnect = async (platform) => {
    const account = accounts.find(a => a.platform === platform);
    if (!account) return;
    
    try {
      await api.socialAccounts.disconnect(account.id);
      await loadAccounts();
      toast.success(`${PLATFORMS.find(p => p.key === platform)?.label} disconnected`);
    } catch (error) {
      toast.error("Failed to disconnect");
    }
  };

  const connectedPlatforms = accounts.map(a => a.platform);
  const currentPlatform = PLATFORMS.find(p => p.key === connectingPlatform) || { bg: 'bg-gray-500', hover: '' };

  return (
    <div className="max-w-3xl mx-auto p-6 lg:p-8">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Connect Accounts</h1>
        <p className="text-sm text-muted-foreground mt-1">Link your social media to post clips directly</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {PLATFORMS.map((platform) => (
          <PlatformCard
            key={platform.key}
            platform={connectingPlatform === platform.key ? { ...platform, ...currentPlatform, key: 'connecting' } : platform}
            connected={connectedPlatforms.includes(platform.key)}
            onConnect={handleConnect}
          />
        ))}
      </div>

      {accounts.length > 0 && (
        <div className="mt-8 p-4 rounded-xl bg-card border border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Connected Accounts</h3>
          <div className="space-y-2">
            {accounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                <span className="text-sm font-medium">{PLATFORMS.find(p => p.key === account.platform)?.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">@{account.username}</span>
                  <button
                    onClick={() => handleDisconnect(account.platform)}
                    className="text-xs text-destructive hover:underline"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}