import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get("code");
      const errorParam = params.get("error");
      
      if (errorParam) {
        setError(errorParam);
        return;
      }
      
      if (code) {
        // Get the platform from the path
        const pathParts = location.pathname.split("/");
        const platform = pathParts[pathParts.length - 1];
        
        if (platform === "google") {
          // Send code to parent window and close
          window.opener.postMessage({ type: "google-oauth-success", code }, "*");
          window.close();
        } else {
          // For other platforms, redirect to social accounts
          try {
            const response = await fetch(`/api/social-accounts/callback/${platform}`, {
              method: "POST",
              headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
              },
              body: JSON.stringify({ code })
            });
            
            if (response.ok) {
              navigate("/dashboard/social");
            } else {
              setError("Failed to connect account");
            }
          } catch (e) {
            setError("Failed to connect account");
          }
        }
      }
    };
    
    handleCallback();
  }, [location, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <button onClick={() => navigate("/dashboard/social")} className="text-primary hover:underline">
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Completing authentication...</p>
      </div>
    </div>
  );
}