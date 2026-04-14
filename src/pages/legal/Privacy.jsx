import { Link } from "react-router-dom";
import { Zap, Shield, Zap as ZapIcon, Lock, Eye, User, Database, Globe, Mail } from "lucide-react";
import Footer from "@/components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        
        <div className="relative max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
            <ZapIcon className="h-4 w-4" />
            Privacy Policy
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
            Privacy
            <span className="bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent">
              {" "}Policy
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground">
            Last updated: April 14, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <div className="bg-card border border-border rounded-3xl p-8 lg:p-12 space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <User className="h-6 w-6 text-primary" />
                Introduction
              </h2>
              <p className="text-muted-foreground">
                At PixelSpido, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, 
                and safeguard your information when you use our platform. Please read this policy carefully.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Database className="h-6 w-6 text-primary" />
                Information We Collect
              </h2>
              <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
              <p className="text-muted-foreground mb-4">
                We collect information you provide directly to us, such as your name, email address, and profile information 
                when you create an account or communicate with us.
              </p>
              <h3 className="text-xl font-semibold mb-2">Usage Information</h3>
              <p className="text-muted-foreground mb-4">
                We automatically collect information about how you interact with our platform, including videos you upload, 
                projects you create, and features you use.
              </p>
              <h3 className="text-xl font-semibold mb-2">Social Media Information</h3>
              <p className="text-muted-foreground">
                When you connect social media accounts, we collect information that you authorize us to access, 
                such as your profile information and content.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Eye className="h-6 w-6 text-primary" />
                How We Use Your Information
              </h2>
              <p className="text-muted-foreground mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Provide, maintain, and improve our services</li>
                <li>Process your videos and generate AI-powered insights</li>
                <li>Send you important updates and notifications</li>
                <li>Respond to your comments and questions</li>
                <li>Analyze usage patterns to enhance user experience</li>
                <li>Protect against fraud and abuse</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Globe className="h-6 w-6 text-primary" />
                Information Sharing
              </h2>
              <p className="text-muted-foreground mb-4">
                We do not sell your personal information. We may share your information with:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Service providers who help us operate our platform</li>
                <li>Social media platforms when you connect your accounts</li>
                <li>Legal authorities when required by law</li>
                <li>Business partners with your consent</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                Data Security
              </h2>
              <p className="text-muted-foreground mb-4">
                We implement appropriate technical and organizational measures to protect your information, 
                including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security audits</li>
                <li>Access controls and authentication</li>
                <li>Secure data storage facilities</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Lock className="h-6 w-6 text-primary" />
                Your Rights
              </h2>
              <p className="text-muted-foreground mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Export your data</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:privacy@velocity.video" className="text-primary hover:underline">
                  privacy@velocity.video
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}