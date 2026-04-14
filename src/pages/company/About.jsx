import { Link } from "react-router-dom";
import { Zap, Users, Target, Heart, Zap as ZapIcon, ArrowRight, Globe, Award, Rocket, Sparkles, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

const values = [
  {
    icon: Heart,
    title: "Creator First",
    description: "We build for creators. Every feature, every decision, starts with understanding your needs.",
  },
  {
    icon: Target,
    title: "Simplicity",
    description: "Powerful doesn't have to be complex. We make AI accessible to everyone.",
  },
  {
    icon: Rocket,
    title: "Innovation",
    description: "We're constantly pushing boundaries to give you the best video tools.",
  },
  {
    icon: Heart,
    title: "Trust",
    description: "Your data is yours. We never sell or share your content without permission.",
  },
];

const team = [
  {
    name: "Alex Kimani",
    role: "CEO & Co-founder",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    bio: "Former YouTube engineer. 10+ years in video platform development.",
  },
  {
    name: "Sarah Chen",
    role: "CTO & Co-founder",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    bio: "AI researcher. Previously at Google DeepMind.",
  },
  {
    name: "Marcus Johnson",
    role: "Head of Product",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    bio: "Built products at TikTok and Instagram. Passionate creator.",
  },
  {
    name: "Emily Rodriguez",
    role: "Head of Design",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    bio: "Award-winning designer. Previously lead at Figma.",
  },
];

const timeline = [
  { year: "2023", event: "Founded in Nairobi, Kenya" },
  { year: "2023", event: "Beta launch with 1,000 creators" },
  { year: "2024", event: "1M videos processed" },
  { year: "2024", event: "Series A funding" },
  { year: "2025", event: "500,000+ active users" },
  { year: "2025", event: "Expanded to 50+ countries" },
];

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="absolute inset-0 bg-[radial_gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <ZapIcon className="h-4 w-4" />
              About PixelSpido
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight">
              Empowering Creators<br />
              <span className="bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent">
                to Go Viral
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're on a mission to make professional video content creation accessible to everyone. 
              No editing skills required — just upload and let AI do the magic.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 border-y border-border/50 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "10M+", label: "Videos Processed" },
              { value: "500K+", label: "Active Users" },
              { value: "50+", label: "Countries" },
              { value: "99.9%", label: "Uptime" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Story</h2>
          </div>
          
          <div className="prose prose-lg mx-auto text-muted-foreground">
            <p>
              PixelSpido was born from a simple frustration: creating short-form video content is incredibly time-consuming, 
              even for professionals. The average creator spends hours editing each viral clip.
            </p>
            <p>
              We believed there had to be a better way. Combining our expertise in video engineering and AI, 
              we built PixelSpido — a platform that uses advanced AI to automatically identify the most engaging moments 
              in any video and formats them perfectly for every platform.
            </p>
            <p>
              Today, we're proud to serve over 500,000 creators worldwide, from solo YouTubers to Fortune 500 marketing teams.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground text-lg">What drives us every day</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <div key={i} className="p-6 rounded-2xl bg-card border border-border text-center">
                <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Journey</h2>
          </div>
          
          <div className="space-y-6">
            {timeline.map((item, i) => (
              <div key={i} className="flex items-center gap-6">
                <div className="w-24 text-lg font-bold text-primary">{item.year}</div>
                <div className="flex-1 p-4 rounded-xl bg-card border border-border">{item.event}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-6 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Meet the Team</h2>
            <p className="text-muted-foreground text-lg">The people behind PixelSpido</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="p-6 rounded-2xl bg-card border border-border text-center">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-primary mb-2">{member.role}</p>
                <p className="text-xs text-muted-foreground">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-primary/20 via-purple-500/20 to-accent/20 border border-primary/20 text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Team</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              We're always looking for talented people to help us build the future of video content.
            </p>
            <Link to="/careers">
              <Button size="lg" className="gap-2">
                View Open Positions <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}