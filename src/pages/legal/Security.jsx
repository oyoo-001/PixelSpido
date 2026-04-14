import { Link } from "react-router-dom";
import { Zap, Shield, Zap as ZapIcon, Lock, Server, Database, Bug, Eye, CheckCircle, FileKey, Clock, Phone, Mail } from "lucide-react";
import Footer from "@/components/Footer";

const certifications = [
  { name: "SOC 2 Type II", status: "Certified" },
  { name: "GDPR", status: "Compliant" },
  { name: "ISO 27001", status: "Certified" },
  { name: "PCI DSS", status: "Level 1" },
];

const measures = [
  {
    icon: Lock,
    title: "Encryption",
    description: "All data is encrypted in transit (TLS 1.3) and at rest (AES-256).",
  },
  {
    icon: Server,
    title: "Secure Infrastructure",
    description: "Hosted on SOC 2 compliant cloud providers with 24/7 monitoring.",
  },
  {
    icon: Bug,
    title: "Regular Audits",
    description: "Third-party penetration testing and security audits quarterly.",
  },
  {
    icon: Eye,
    title: "Access Controls",
    description: "Role-based access and multi-factor authentication required.",
  },
  {
    icon: FileKey,
    title: "Data Privacy",
    description: "Your data never sold. Full GDPR and CCPA compliance.",
  },
  {
    icon: Clock,
    title: "Incident Response",
    description: "24/7 security team with documented response procedures.",
  },
];

const practices = [
  "All user passwords hashed with bcrypt (cost factor 12)",
  "Multi-factor authentication (MFA) available",
  "Session timeout after 30 minutes of inactivity",
  "Automatic security updates applied",
  "Web Application Firewall (WAF) protection",
  "DDoS mitigation in place",
  "Regular backup with encryption",
  "Staff security training required",
];

export default function Security() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        
        <div className="relative max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
            <ZapIcon className="h-4 w-4" />
            Security
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
            Your Security
            <span className="bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent">
              {" "}Matters
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground">
            We take security seriously. Learn how we protect your data.
          </p>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 px-6 border-b border-border/50">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {certifications.map((cert, i) => (
              <div key={i} className="p-4 rounded-xl bg-card border border-border text-center">
                <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
                <p className="font-semibold">{cert.name}</p>
                <p className="text-xs text-muted-foreground">{cert.status}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Measures */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How We Protect You</h2>
            <p className="text-muted-foreground text-lg">Enterprise-grade security measures</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {measures.map((measure, i) => (
              <div key={i} className="p-6 rounded-2xl bg-card border border-border">
                <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                  <measure.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{measure.title}</h3>
                <p className="text-sm text-muted-foreground">{measure.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="py-24 px-6 bg-card/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Security Best Practices</h2>
            <p className="text-muted-foreground text-lg">What we do to keep you safe</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {practices.map((practice, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                <span className="text-sm">{practice}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vulnerability Reporting */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-primary/20 via-purple-500/20 to-accent/20 border border-primary/20">
            <div className="text-center">
              <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Found a Security Issue?</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                We appreciate responsible disclosure. If you've found a security vulnerability, please let us know.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="mailto:security@velocity.video" className="flex items-center justify-center gap-2 text-primary hover:underline">
                  <Mail className="h-4 w-4" /> security@velocity.video
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground">
            For security concerns, contact{' '}
            <a href="mailto:security@velocity.video" className="text-primary hover:underline">
              security@velocity.video
            </a>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}