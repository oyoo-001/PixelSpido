import { Link } from 'react-router-dom';
import { Home, Zap } from 'lucide-react';

export default function PageNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-8xl font-bold text-primary/20">404</h1>
            <div className="h-0.5 w-16 bg-border mx-auto"></div>
          </div>
          
          <div className="space-y-3">
            <h2 className="text-2xl font-medium text-foreground">
              Page Not Found
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <div className="pt-6">
            <Link 
              to="/" 
              className="inline-flex items-center px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}