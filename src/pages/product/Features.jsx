import { Link } from "react-router-dom";
import { Zap, Film, Sparkles, Share2, BarChart3, Download, Upload, Wand2, Languages, Clock, TrendingUp, Users, Shield, Zap as ZapIcon, Check, ArrowRight, Play, Megaphone, Headphones, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

const aiFeatures = [
  {
    icon: Sparkles,
    title: "Smart Scene Detection",
    description: "AI automatically identifies scene changes, transitions, and topic shifts to find natural clip boundaries.",
  },
  {
    icon: Wand2,
    title: "Engagement Scoring",
    description: "Our AI analyzes facial expressions, audio peaks, and motion patterns to score each moment's viral potential.",
  },
  {
    icon: TrendingUp,
    title: "Trend Analysis",
    description: "Stay ahead of the curve with real-time analysis of trending topics and formats in your niche.",
  },
  {
    icon: Languages,
    title: "Auto Captioning",
    description: "Generate accurate, engaging captions in 50+ languages. Custom styles and emojis included.",
  },
];

const exportFeatures = [
  {
    icon: Download,
    title: "One-Click Export",
    description: "Export in the perfect format for each platform. No manual resizing or formatting needed.",
  },
  {
    icon: Share2,
    title: "Direct Publishing",
    description: "Connect your social accounts and post directly from PixelSpido. Schedule posts for optimal times.",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Track views, likes, shares, and comments across all platforms from one dashboard.",
  },
  {
    icon: Clock,
    title: "Batch Processing",
    description: "Process multiple videos at once. Set it and forget it while PixelSpido handles the workload.",
  },
];

const supportFeatures = [
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "SOC 2 compliant, encrypted storage, and advanced access controls keep your content safe.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Add team members, assign roles, and collaborate on projects with shared workspaces.",
  },
  {
    icon: Headphones,
    title: "Priority Support",
    description: "Get help when you need it with 24/7 priority support for Pro and Business plans.",
  },
  {
    icon: Megaphone,
    title: "API Access",
    description: "Build custom integrations with our robust REST API. Webhooks, SDKs, and full documentation included.",
  },
];

export default function Features() {
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
              Powerful Features
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight">
              Everything You Need to<br />
              <span className="bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent">
                Create Viral Content
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced AI tools, seamless integrations, and powerful features designed 
              to maximize your content's reach and engagement.
            </p>
          </div>
        </div>
      </section>

      {/* AI Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">AI-Powered Intelligence</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Cutting-edge AI that understands what makes content go viral
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {aiFeatures.map((feature, i) => (
              <div 
                key={i}
                className="group p-8 rounded-3xl bg-card border border-border hover:border-primary/50 transition-all duration-300"
              >
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/30 to-purple-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Export Features */}
      <section className="py-24 px-6 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Export & Publish</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get your content where it matters most
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {exportFeatures.map((feature, i) => (
              <div 
                key={i}
                className="group p-8 rounded-3xl bg-card border border-border hover:border-primary/50 transition-all duration-300"
              >
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-7 w-7 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Enterprise & Team</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Built for teams and scaled for enterprises
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {supportFeatures.map((feature, i) => (
              <div 
                key={i}
                className="group p-8 rounded-3xl bg-card border border-border hover:border-primary/50 transition-all duration-300"
              >
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500/30 to-accent/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-7 w-7 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-24 px-6 bg-card/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Compare Plans</h2>
            <p className="text-muted-foreground text-lg">Choose the plan that fits your needs</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-card border border-border">
              <h3 className="text-xl font-semibold mb-2">Starter</h3>
              <p className="text-muted-foreground mb-6">Perfect for individuals</p>
              <ul className="space-y-3 mb-8">
                {["5 projects/month", "Basic AI analysis", "720p exports", "Community support"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/login" className="block">
                <Button variant="outline" className="w-full">Get Started</Button>
              </Link>
            </div>
            
            <div className="p-8 rounded-3xl bg-gradient-to-br from-primary/20 to-purple-500/20 border-2 border-primary">
              <div className="px-3 py-1 bg-gradient-to-r from-primary to-purple-500 rounded-full text-xs font-medium text-white inline-block mb-2">
                Most Popular
              </div>
              <h3 className="text-xl font-semibold mb-2">Pro</h3>
              <p className="text-muted-foreground mb-6">For serious creators</p>
              <ul className="space-y-3 mb-8">
                {["Unlimited projects", "Advanced AI", "4K exports", "Priority support", "Analytics"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/login" className="block">
                <Button className="w-full bg-gradient-to-r from-primary to-purple-500">Get Started</Button>
              </Link>
            </div>
            
            <div className="p-8 rounded-3xl bg-card border border-border">
              <h3 className="text-xl font-semibold mb-2">Business</h3>
              <p className="text-muted-foreground mb-6">For teams & agencies</p>
              <ul className="space-y-3 mb-8">
                {["Everything in Pro", "Team (5 users)", "API access", "Custom integrations", "Dedicated support"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/login" className="block">
                <Button variant="outline" className="w-full">Contact Sales</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="p-16 lg:p-24 rounded-3xl bg-gradient-to-br from-primary/20 via-purple-500/20 to-accent/20 border border-primary/20 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Join 500,000+ creators already using PixelSpido
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