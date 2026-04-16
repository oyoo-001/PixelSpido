import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import Footer from "@/components/Footer";
import SupportWidget from "@/components/SupportWidget";
import { Zap, Play, Film, Sparkles, ArrowRight, User, Settings, LogOut, ChevronDown, Loader2, Check, Star, Zap as ZapIcon, Crown, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Film,
    title: "Upload Video",
    description: "Drop in your long-form content and let AI analyze it instantly",
  },
  {
    icon: Sparkles,
    title: "AI Extraction",
    description: "Automatically find the most engaging viral-worthy moments",
  },
  {
    icon: Play,
    title: "Multi-Platform",
    description: "Export optimized clips for TikTok, Reels, Shorts, and LinkedIn",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Content Creator",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    content: "PixelSpido transformed my workflow. I used to spend hours editing, now AI does it in minutes!",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "YouTuber",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    content: "The AI-generated captions are incredibly engaging. My engagement has doubled since using PixelSpido.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Marketing Manager",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    content: "Game changer for our social media team. We can now produce 10x more content with half the effort.",
    rating: 5,
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "0",
    description: "Perfect for creators just starting out",
    icon: ZapIcon,
    features: ["5 projects per month", "Basic AI analysis", "720p exports", "Community support"],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "29",
    description: "For serious content creators",
    icon: Crown,
    features: ["Unlimited projects", "Advanced AI analysis", "4K exports", "Priority support", "Custom captions", "Analytics"],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Business",
    price: "99",
    description: "For teams and agencies",
    icon: Rocket,
    features: ["Everything in Pro", "Team collaboration", "API access", "Custom integrations", "Dedicated support", "SLA"],
    cta: "Contact Sales",
    popular: false,
  },
];

function UserMenu({ user, onLogout }) {
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

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md"
      >
        {user.avatar_url ? (
          <img src={user.avatar_url} alt="" className="h-8 w-8 rounded-full object-cover" />
        ) : (
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
        )}
        <span className="text-white text-sm font-medium">{user.name}</span>
        <ChevronDown className={`h-4 w-4 text-white/70 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 py-1 rounded-xl bg-card border border-border shadow-xl overflow-hidden z-50">
          <Link to="/dashboard/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary" onClick={() => setOpen(false)}>
            <User className="h-4 w-4" /> My Profile
          </Link>
          <Link to="/dashboard/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary" onClick={() => setOpen(false)}>
            <Settings className="h-4 w-4" /> Settings
          </Link>
          <button onClick={() => { setOpen(false); onLogout(); }} className="flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-secondary w-full">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default function Landing() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80 z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
        <img src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1920&q=80" alt="" className="w-full h-full object-cover" />
      </div>

      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-4 lg:px-12 backdrop-blur-sm">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">PixelSpido</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/product" className="text-sm text-white/70 hover:text-white transition-colors">Product</Link>
          <Link to="/features" className="text-sm text-white/70 hover:text-white transition-colors">Features</Link>
          <Link to="/pricing" className="text-sm text-white/70 hover:text-white transition-colors">Pricing</Link>
          <Link to="/about" className="text-sm text-white/70 hover:text-white transition-colors">About</Link>
          <Link to="/blog" className="text-sm text-white/70 hover:text-white transition-colors">Blog</Link>
        </div>

        {isAuthenticated && user ? (
          <UserMenu user={user} onLogout={() => { logout(); navigate("/"); }} />
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
            <Link to="/login">
              <Button className="gap-2 bg-white text-black hover:bg-white/90 font-medium">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </nav>

      {/* Hero */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
        <div className="max-w-4xl space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">AI-Powered Content Engine</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
            Turn Long Videos into
            <span className="block bg-gradient-to-r from-primary via-purple-400 to-accent bg-clip-text text-transparent">
              Viral Shorts
            </span>
          </h1>
          
          <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Upload your content, let AI identify the most engaging moments, and automatically generate 
            optimized clips for every social platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {!isAuthenticated && (
              <Link to="/login">
                <Button size="lg" className="gap-2 px-8 h-14 text-lg bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 shadow-lg shadow-primary/25">
                  Start Creating Free <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            )}
            {isAuthenticated && (
              <Link to="/dashboard">
                <Button size="lg" className="gap-2 px-8 h-14 text-lg bg-white text-black hover:bg-white/90 shadow-lg">
                  Go to Dashboard <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>

          <div className="flex items-center justify-center gap-8 pt-8 text-white/60">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-accent" />
              <span className="text-sm">No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-accent" />
              <span className="text-sm">5 minutes setup</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-accent" />
              <span className="text-sm">Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="relative z-10 px-6 py-24 lg:px-12 bg-gradient-to-b from-transparent to-black/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">Three simple steps to transform your content</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all duration-300 group hover:-translate-y-2">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-white/60">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="relative z-10 px-6 py-24 lg:px-12 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Loved by Creators</h2>
            <p className="text-lg text-white/60">See what our users are saying</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-white/80 mb-6">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <img src={testimonial.avatar} alt={testimonial.name} className="h-10 w-10 rounded-full object-cover" />
                  <div>
                    <p className="font-medium text-white">{testimonial.name}</p>
                    <p className="text-sm text-white/60">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="relative z-10 px-6 py-24 lg:px-12 bg-gradient-to-b from-black/50 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Simple Pricing</h2>
            <p className="text-lg text-white/60">Choose the plan that works for you</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, i) => (
              <div key={i} className={`relative p-8 rounded-3xl ${plan.popular ? 'bg-gradient-to-br from-primary/20 to-purple-500/20 border-2 border-primary' : 'bg-white/5 border border-white/10'} backdrop-blur-md`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary to-purple-500 rounded-full text-sm font-medium text-white">
                    Most Popular
                  </div>
                )}
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/50 to-purple-500/50 flex items-center justify-center mb-6">
                  <plan.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold text-white">${plan.price}</span>
                  <span className="text-white/60">/month</span>
                </div>
                <p className="text-white/60 text-sm mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-white/80">
                      <Check className="h-4 w-4 text-accent" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
</ul>
                <Link to={plan.cta === "Get Started" ? "/login?redirect=/dashboard/pricing" : "#"}>
                  <Button className={`w-full ${plan.popular ? 'bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90' : 'bg-white/10 hover:bg-white/20'} text-white`}>
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="relative z-10 px-6 py-24 lg:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-primary/20 via-purple-500/20 to-accent-500/20 border border-white/10 backdrop-blur-md">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Ready to Go Viral?</h2>
            <p className="text-lg text-white/70 mb-8">Start creating engaging content in minutes</p>
            <Link to="/login?redirect=/dashboard/pricing">
              <Button size="lg" className="gap-2 px-8 h-14 text-lg bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 shadow-lg shadow-primary/25">
                Get Started Now <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
      
      {/* Support Widget */}
      <SupportWidget />
    </div>
  );
}