import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, Users, DollarSign, Headphones, MessageSquare, 
  Zap, LogOut, Settings, ChevronLeft, BarChart3, Send
} from "lucide-react";

const adminNavItems = [
  { path: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/admin/users", icon: Users, label: "Users" },
  { path: "/admin/finance", icon: DollarSign, label: "Finance" },
  { path: "/admin/support", icon: Headphones, label: "Support" },
  { path: "/admin/messages", icon: MessageSquare, label: "Messages" },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Admin Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card/50 backdrop-blur-xl fixed h-full">
        <div className="p-6">
          <Link to="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight">PixelSpido</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">Admin Panel</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {adminNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-red-500/10 text-red-500"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border space-y-1">
          <Link
            to="/admin/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/dashboard" className="flex-1 flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4" /> User Panel
            </Link>
          </div>
        </div>

        <div className="p-3 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center">
                <span className="text-xs font-medium text-white">{user?.name?.charAt(0)}</span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-border bg-card/80 backdrop-blur-xl">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold">Admin Panel</span>
          </Link>
          <Link to="/dashboard" className="p-2">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </header>
        <nav className="flex items-center justify-around p-2 border-b border-border bg-card/50">
          {adminNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg transition-all",
                  isActive ? "text-red-500" : "text-muted-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px]">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:pl-64 bg-background">
        <main className="flex-1 overflow-auto bg-background min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}