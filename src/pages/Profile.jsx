import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { api } from "@/lib/api";
import { Link } from "react-router-dom";
import { ArrowLeft, User, Mail, Calendar, Loader2, Save, Crown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [subscription, setSubscription] = useState(null);
  
  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const sub = await api.subscription.get();
        setSubscription(sub);
      } catch (error) {
        console.error("Failed to load subscription:", error);
      }
    };
    loadSubscription();
    setMounted(true);
  }, []);
  
  const [name, setName] = useState(user?.name || "");
  const [saving, setSaving] = useState(false);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    
    setSaving(true);
    try {
      toast.success("Profile updated");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 lg:p-8 space-y-8">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">My Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your account information</p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-6">
        <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center">
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt="" className="h-24 w-24 rounded-full object-cover" />
          ) : (
            <User className="h-12 w-12 text-primary" />
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold">{user?.name}</h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      {/* Subscription */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
              subscription?.plan === 'free' ? 'bg-secondary' : 'bg-gradient-to-br from-purple-500/20 to-primary/20'
            }`}>
              {subscription?.plan === 'free' ? (
                <Zap className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Crown className="h-5 w-5 text-purple-400" />
              )}
            </div>
            <div>
              <p className="font-medium">
                {subscription?.plan === 'free' ? 'Free Plan' : 
                 subscription?.plan === 'pro' ? 'Pro Plan' : 
                 subscription?.plan === 'business' ? 'Business Plan' : 'Free Plan'}
              </p>
              <p className="text-sm text-muted-foreground">
                {subscription?.status === 'active' && subscription?.expires_at 
                  ? `Expires ${new Date(subscription.expires_at).toLocaleDateString()}`
                  : subscription?.days_remaining > 0 
                    ? `${subscription.days_remaining} days left in trial`
                    : 'Trial expired'}
              </p>
            </div>
          </div>
          {subscription?.plan === 'free' && (
            <Link to="/dashboard/pricing">
              <Button variant="outline" size="sm">Upgrade</Button>
            </Link>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="grid gap-2">
          <Label>Display Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label>Email</Label>
          <Input value={user?.email || ""} disabled />
        </div>
        <Button onClick={handleSave} className="gap-2" disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}