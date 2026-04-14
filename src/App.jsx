import { Toaster } from "sonner"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { ThemeProvider } from '@/lib/ThemeProvider';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import NewProject from './pages/NewProject';
import ProjectDetail from './pages/ProjectDetail';
import SocialAccounts from './pages/SocialAccounts';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import OAuthCallback from './pages/OAuthCallback';
import Pricing from './pages/Pricing';
import PaymentSuccess from './pages/PaymentSuccess';
import ForgotPassword from './pages/ForgotPassword';
import AdminDashboard from './pages/AdminDashboard';
import Product from './pages/product/Product';
import Features from './pages/product/Features';
import PricingPage from './pages/product/Pricing';
import Integrations from './pages/product/Integrations';
import ApiDocs from './pages/product/ApiDocs';
import About from './pages/company/About';
import Blog from './pages/company/Blog';
import Careers from './pages/company/Careers';
import Contact from './pages/company/Contact';
import Privacy from './pages/legal/Privacy';
import Terms from './pages/legal/Terms';
import Security from './pages/legal/Security';

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoadingAuth } = useAuth();
  
  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function AuthRoute({ children }) {
  const { isAuthenticated, isLoadingAuth } = useAuth();
  
  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

function AdminRoute({ children }) {
  const { user, isAuthenticated, isLoadingAuth } = useAuth();
  
  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <Routes>
              {/* Public Pages */}
              <Route path="/" element={<Landing />} />
              <Route path="/product" element={<Product />} />
              <Route path="/features" element={<Features />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/integrations" element={<Integrations />} />
              <Route path="/api-docs" element={<ApiDocs />} />
              <Route path="/about" element={<About />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/security" element={<Security />} />
              
              <Route path="/oauth-callback/:platform" element={<OAuthCallback />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminRoute><Layout /></AdminRoute>}>
                <Route index element={<AdminDashboard />} />
              </Route>
              
              {/* Dashboard Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="new" element={<NewProject />} />
                <Route path="project/:id" element={<ProjectDetail />} />
                <Route path="social" element={<SocialAccounts />} />
                <Route path="settings" element={<Settings />} />
                <Route path="profile" element={<Profile />} />
                <Route path="pricing" element={<Pricing />} />
              </Route>
            </Routes>
          </Router>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;