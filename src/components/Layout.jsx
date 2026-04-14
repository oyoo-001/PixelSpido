import { useState, useEffect, useRef } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Plus, Zap, LogOut, Share2, User, Settings, ChevronDown, CreditCard, Shield } from "lucide-react";

const navItems = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/dashboard/new", icon: Plus, label: "New Project" },
  { path: "/dashboard/social", icon: Share2, label: "Connect Accounts" },
  { path: "/dashboard/pricing", icon: CreditCard, label: "Pricing" },
];

function UserMenu() {
  const { user, logout, subscription } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-secondary transition-colors"
      >
        {user?.avatar_url ? (
          <img src={user.avatar_url} alt="" className="h-8 w-8 rounded-full object-cover" />
        ) : (
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
        )}
        <span className="text-sm font-medium hidden md:block">{user?.name}</span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 bottom-full mb-2 w-56 py-1 rounded-xl bg-card border border-border shadow-xl overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
            {subscription?.plan !== 'free' && (
              <p className="text-xs text-primary mt-1">{subscription?.plan} Plan</p>
            )}
          </div>
          {user?.role === 'admin' && (
            <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-secondary text-primary" onClick={() => setOpen(false)}>
              <Shield className="h-4 w-4" /> Admin Dashboard
            </Link>
          )}
          <Link to="/dashboard/profile" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-secondary" onClick={() => setOpen(false)}>
            <User className="h-4 w-4" /> My Profile
          </Link>
          <Link to="/dashboard/settings" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-secondary" onClick={() => setOpen(false)}>
            <Settings className="h-4 w-4" /> Settings
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-secondary w-full">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card/50 backdrop-blur-xl fixed h-full">
        <div className="p-6">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight">PixelSpido</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">Content Engine</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <div className="flex items-center justify-between">
            <UserMenu />
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-border bg-card/80 backdrop-blur-xl">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold">PixelSpido</span>
          </Link>
          <UserMenu />
        </header>
        <nav className="flex items-center justify-around p-2 border-b border-border bg-card/50">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg transition-all",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px]">{item.label.split(" ")[0]}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:pl-64">
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-card/30 py-8 px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                <Zap className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm font-medium">PixelSpido</span>
            </div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} PixelSpido. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}