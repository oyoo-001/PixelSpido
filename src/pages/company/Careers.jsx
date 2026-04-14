import { useState } from "react";
import { Link } from "react-router-dom";
import { Zap, MapPin, Clock, ArrowRight, Zap as ZapIcon, Briefcase, GraduationCap, Code, Palette, Megaphone, Headphones, Globe, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

const benefits = [
  { icon: CheckCircle, text: "Competitive salary & equity" },
  { icon: CheckCircle, text: "Remote-first culture" },
  { icon: CheckCircle, text: "Health insurance" },
  { icon: CheckCircle, text: "Unlimited PTO" },
  { icon: CheckCircle, text: "Learning budget" },
  { icon: CheckCircle, text: "Home office setup" },
  { icon: CheckCircle, text: "Wellness stipend" },
  { icon: CheckCircle, text: "Parental leave" },
];

const jobs = [
  {
    department: "Engineering",
    positions: [
      { title: "Senior Backend Engineer", location: "Remote", type: "Full-time", description: "Build scalable APIs and video processing systems." },
      { title: "Frontend Engineer", location: "Remote", type: "Full-time", description: "Create beautiful, performant UIs." },
      { title: "ML Engineer", location: "Remote", type: "Full-time", description: "Work on video AI models." },
    ],
  },
  {
    department: "Product",
    positions: [
      { title: "Product Manager", location: "Remote", type: "Full-time", description: "Define and drive product strategy." },
      { title: "UX Designer", location: "Remote", type: "Full-time", description: "Design intuitive user experiences." },
    ],
  },
  {
    department: "Growth",
    positions: [
      { title: "Growth Marketing Manager", location: "Remote", type: "Full-time", description: "Scale user acquisition." },
      { title: "Developer Advocate", location: "Remote", type: "Full-time", description: "Support our developer community." },
    ],
  },
  {
    department: "Operations",
    positions: [
      { title: "Customer Success Lead", location: "Remote", type: "Full-time", description: "Help our users succeed." },
    ],
  },
];

export default function Careers() {
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
              We're Hiring
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight">
              Join the
              <span className="bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent">
                {" "}Team
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Help us build the future of video content creation. 
              We're looking for passionate people to join our remote-first team.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why PixelSpido?</h2>
            <p className="text-muted-foreground text-lg"> perks and benefits you'll love</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                <benefit.icon className="h-5 w-5 text-green-500 shrink-0" />
                <span className="text-sm">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-24 px-6 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Open Positions</h2>
            <p className="text-muted-foreground text-lg"> Find your next role</p>
          </div>
          
          {jobs.map((department, i) => (
            <div key={i} className="mb-12">
              <h3 className="text-xl font-semibold mb-4">{department.department}</h3>
              <div className="space-y-3">
                {department.positions.map((job, j) => (
                  <div 
                    key={j}
                    className="flex items-center justify-between p-5 rounded-xl bg-card border border-border hover:border-primary/50 transition-all"
                  >
                    <div>
                      <h4 className="font-medium">{job.title}</h4>
                      <p className="text-sm text-muted-foreground">{job.description}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" /> {job.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Culture</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-card border border-border text-center">
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Remote First</h3>
              <p className="text-sm text-muted-foreground">Work from anywhere in the world. We're timezone-flexible.</p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border text-center">
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Ownership</h3>
              <p className="text-sm text-muted-foreground">Take ownership of projects. Make big decisions.</p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border text-center">
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Growth</h3>
              <p className="text-sm text-muted-foreground">Learn and grow. We invest in your development.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Apply */}
      <section className="py-24 px-6 bg-card/30">
        <div className="max-w-4xl mx-auto">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-primary/20 via-purple-500/20 to-accent/20 border border-primary/20 text-center">
            <h2 className="text-3xl font-bold mb-4">Don't See the Right Role?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              We're always looking for exceptional talent. Send us your resume and we'll be in touch.
            </p>
            <Link to="/contact">
              <Button size="lg" className="gap-2">
                Get in Touch <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}