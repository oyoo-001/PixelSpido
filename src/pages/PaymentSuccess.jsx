import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "@/lib/api";
import { CheckCircle, XCircle, Loader2, ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const reference = searchParams.get("reference");
    if (reference) {
      verifyPayment(reference);
    } else {
      setVerifying(false);
      setStatus("no_reference");
    }
  }, [searchParams]);

  const verifyPayment = async (reference) => {
    try {
      const result = await api.subscription.verifyPayment({ reference });
      setStatus("success");
      toast.success("Payment successful! Your subscription is now active.");
    } catch (error) {
      console.error("Payment verification failed:", error);
      setStatus("failed");
      toast.error("Payment verification failed. Please contact support.");
    } finally {
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md w-full text-center">
          <div className="h-24 w-24 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground mb-8">
            Thank you for your purchase. Your subscription is now active and you have full access to all features.
          </p>
          <div className="space-y-3">
            <Link to="/dashboard">
              <Button className="w-full">Go to Dashboard</Button>
            </Link>
            <Link to="/dashboard/pricing">
              <Button variant="outline" className="w-full">View Subscription Details</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-md w-full text-center">
        <div className="h-24 w-24 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mx-auto mb-6">
          <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
        <p className="text-muted-foreground mb-8">
          {status === "no_reference" 
            ? "No payment reference was found. Please try again."
            : "There was an issue verifying your payment. Please contact support."}
        </p>
        <div className="space-y-3">
          <Link to="/dashboard/pricing">
            <Button className="w-full">Try Again</Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline" className="w-full">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}