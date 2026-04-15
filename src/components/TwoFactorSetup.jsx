import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { showToast, showSuccess } from "@/lib/toast-utils";
import { Shield, ShieldCheck, ShieldOff, Loader2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TwoFactorSetup({ enabled, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [setupData, setSetupData] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState(null);

  useEffect(() => {
    if (setupData?.otpauthUrl) {
      import("qrcode").then(QRCode => {
        QRCode.toDataURL(setupData.otpauthUrl, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        }).then(setQrDataUrl).catch(console.error);
      }).catch(console.error);
    }
  }, [setupData?.otpauthUrl]);

  const handleEnable = async () => {
    setLoading(true);
    try {
      const res = await api.request('/auth/2fa/setup', { 
        method: 'POST', 
        body: JSON.stringify({ enable: true }) 
      });
      setSetupData(res);
    } catch (error) {
      showToast(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!code || code.length !== 6) {
      showToast({ error: "Enter 6-digit code" }, "Please enter the code from your authenticator");
      return;
    }

    setVerifying(true);
    try {
      await api.request('/auth/2fa/verify', { 
        method: 'POST', 
        body: JSON.stringify({ code }) 
      });
      showSuccess("2FA Enabled!", "Your account is now more secure");
      setSetupData(null);
      setCode("");
      setQrDataUrl(null);
      onUpdate(true);
    } catch (error) {
      showToast(error);
    } finally {
      setVerifying(false);
    }
  };

  const handleDisable = async () => {
    if (!confirm("Are you sure you want to disable 2FA?")) return;
    
    setLoading(true);
    try {
      await api.request('/auth/2fa', { method: 'DELETE' });
      showSuccess("2FA Disabled", "Two-factor authentication has been removed");
      onUpdate(false);
    } catch (error) {
      showToast(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSetupData(null);
    setCode("");
    setQrDataUrl(null);
  };

  const copySecret = () => {
    if (setupData?.secret) {
      navigator.clipboard.writeText(setupData.secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (setupData) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Setup Two-Factor Authentication</h2>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
          </p>

          <div className="flex justify-center">
            {qrDataUrl ? (
              <img 
                src={qrDataUrl}
                alt="2FA QR Code"
                className="border rounded-lg"
              />
            ) : (
              <div className="w-[200px] h-[200px] bg-muted rounded-lg flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-2">Or enter this secret manually:</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-2 bg-secondary rounded text-xs font-mono break-all">
                {setupData.secret}
              </code>
              <Button size="sm" variant="outline" onClick={copySecret}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <form onSubmit={handleVerify} className="space-y-4 pt-4 border-t">
            <div className="space-y-2">
              <Label>Enter 6-digit code</Label>
              <Input
                type="text"
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                className="text-center text-2xl letter-spacing-4"
                autoComplete="one-time-code"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={verifying || code.length !== 6}>
                {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4 mr-2" />}
                Verify & Enable
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
            enabled ? "bg-green-500/20" : "bg-secondary"
          }`}>
            {enabled ? (
              <ShieldCheck className="h-5 w-5 text-green-500" />
            ) : (
              <ShieldOff className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold">Two-Factor Authentication</h2>
            <p className="text-sm text-muted-foreground">
              {enabled ? "Your account is protected with 2FA" : "Add an extra layer of security"}
            </p>
          </div>
        </div>
        
        {enabled ? (
          <Button variant="destructive" onClick={handleDisable} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Disable"}
          </Button>
        ) : (
          <Button onClick={handleEnable} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enable 2FA"}
          </Button>
        )}
      </div>

      {!enabled && (
        <p className="text-sm text-muted-foreground">
          Enable two-factor authentication to add an extra layer of security. 
          You'll need to enter a code from your authenticator app when signing in.
        </p>
      )}
    </div>
  );
}