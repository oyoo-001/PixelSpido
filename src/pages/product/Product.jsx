import { Link } from "react-router-dom";
import { Zap, Film, Sparkles, Share2, BarChart3, Zap as ZapIcon, Check, ArrowRight, Play, Users, Globe, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

const features = [
  {
    icon: Film,
    title: "Video Upload",
    description: "Drop any long-form video and let AI analyze it instantly. Supports MP4, MOV, AVI, WebM and more.",
  },
  {
    icon: Sparkles,
    title: "AI Analysis",
    description: "Gemini AI identifies the most engaging moments, viral-worthy clips, and key highlights.",
  },
  {
    icon: Share2,
    title: "Multi-Platform Export",
    description: "Export optimized clips for TikTok, Instagram Reels, YouTube Shorts, LinkedIn, and Facebook.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Track performance across all platforms with detailed insights and engagement metrics.",
  },
];

const stats = [
  { value: "10M+", label: "Videos Processed" },
  { value: "500K+", label: "Content Creators" },
  { value: "50+", label: "Platforms Supported" },
  { value: "99.9%", label: "Uptime" },
];

export default function Product() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <ZapIcon className="h-4 w-4" />
              AI-Powered Video Platform
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight">
              Transform Long-Form Video<br />
              <span className="bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent">
                Into Viral Short Clips
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              PixelSpido uses advanced AI to automatically extract the most engaging moments from your long-form content. 
              Post to TikTok, Reels, Shorts, and LinkedIn — all from one platform.
            </p>
            
            <div className="flex items-center justify-center gap-4 pt-4">
              <Link to="/login">
                <Button size="lg" className="gap-2 h-12 px-8 text-base">
                  Start Free Trial <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="gap-2 h-12 px-8 text-base">
                <Play className="h-4 w-4" /> Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 border-y border-border/50 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Go Viral</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Powerful features designed for content creators, marketers, and brands
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, i) => (
              <div 
                key={i}
                className="group p-8 rounded-3xl bg-card border border-border hover:border-primary/50 transition-all duration-300"
              >
                <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/30 transition-colors">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 px-6 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">How PixelSpido Works</h2>
            <p className="text-muted-foreground text-lg">From upload to viral in 3 simple steps</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center mx-auto mb-6">
                <Film className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Upload Video</h3>
              <p className="text-muted-foreground">Drop your long-form video or paste a YouTube link. We'll handle any format.</p>
            </div>
            <div className="text-center">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-500 to-accent flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. AI Analysis</h3>
              <p className="text-muted-foreground">Our AI scans your video and identifies the most engaging moments.</p>
            </div>
            <div className="text-center">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center mx-auto mb-6">
                <Share2 className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Export & Share</h3>
              <p className="text-muted-foreground">Download clips perfectly sized for each platform and start posting.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Works With Your Favorite Platforms</h2>
            <p className="text-muted-foreground text-lg">Connect once, post everywhere</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { name: "TikTok", color: "#FE2C55" },
              { name: "YouTube", color: "#FF0000" },
              { name: "Instagram", color: "#E4405F" },
              { name: "Facebook", color: "#1877F2" },
              { name: "LinkedIn", color: "#0A66C2" },
            ].map((platform) => (
              <div 
                key={platform.name}
                className="p-6 rounded-2xl bg-card border border-border text-center hover:border-primary/50 transition-all"
              >
                <div 
                  className="h-12 w-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                  style={{ backgroundColor: platform.color + '20' }}
                >
                  <Globe className="h-6 w-6" style={{ color: platform.color }} />
                </div>
                <p className="font-medium">{platform.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="p-16 lg:p-24 rounded-3xl bg-gradient-to-br from-primary/20 via-purple-500/20 to-accent/20 border border-primary/20 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Content?</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Join thousands of creators already using PixelSpido to grow their audience
            </p>
            <Link to="/login">
              <Button size="lg" className="gap-2 h-14 px-10 text-lg bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90">
                Start Free Trial <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}