import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { showToast, showSuccess } from "@/lib/toast-utils";
import { Zap, Mail, ArrowLeft, Loader2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Footer from "@/components/Footer";

export default function ForgotPassword() {
  const [step, setStep] = useState("email"); // email, verify, reset
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    if (!email) {
      showToast({ error: "Email is required" }, "Please enter your email");
      return;
    }

    setLoading(true);
    try {
      await api.request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
      showSuccess("Check your email", "If the email exists, we've sent a reset code");
      setStep("verify");
    } catch (error) {
      showToast(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) {
      showToast({ error: "OTP is required" }, "Please enter the code from your email");
      return;
    }

    setStep("reset");
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      showToast({ error: "Password required" }, "Please enter and confirm your new password");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast({ error: "Passwords don't match" }, "Make sure both passwords are the same");
      return;
    }
    if (newPassword.length < 6) {
      showToast({ error: "Password too short" }, "Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await api.request('/auth/reset-password', { 
        method: 'POST', 
        body: JSON.stringify({ email, otp, newPassword }) 
      });
      showSuccess("Password reset!", "You can now sign in with your new password");
      setTimeout(() => window.location.href = "/login", 1500);
    } catch (error) {
      showToast(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        
        <div className="relative w-full max-w-md border border-border rounded-lg bg-card p-6 shadow-sm">
          <div className="text-center mb-6">
            <Link to="/" className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-primary/20 mb-4">
              <Zap className="h-6 w-6 text-primary" />
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">
              {step === "email" && "Reset Password"}
              {step === "verify" && "Enter Code"}
              {step === "reset" && "New Password"}
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              {step === "email" && "Enter your email to get a reset code"}
              {step === "verify" && `We sent a code to ${email}`}
              {step === "reset" && "Enter your new password"}
            </p>
          </div>

          {step === "email" && (
            <form onSubmit={handleRequestReset} className="space-y-6">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Reset Code"}
              </Button>
            </form>
          )}

          {step === "verify" && (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="space-y-2">
                <Label>Reset Code</Label>
                <Input
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  className="text-center text-2xl letter-spacing-4"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={otp.length !== 6}>
                Verify Code
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => setStep("email")}>
                Resend Code
              </Button>
            </form>
          )}

          {step === "reset" && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reset Password"}
              </Button>
            </form>
          )}

          <div className="text-center">
            <Link to="/login" className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}