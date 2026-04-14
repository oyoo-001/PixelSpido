import { Link } from "react-router-dom";
import { Zap, Zap as ZapIcon, Book, Scale, AlertTriangle, Ban } from "lucide-react";
import Footer from "@/components/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        
        <div className="relative max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
            <ZapIcon className="h-4 w-4" />
            Terms of Service
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
            Terms of
            <span className="bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent">
              {" "}Service
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground">
            Last updated: April 14, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-3xl p-8 lg:p-12 space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Book className="h-6 w-6 text-primary" />
                Acceptance of Terms
              </h2>
              <p className="text-muted-foreground">
                By accessing and using PixelSpido, you accept and agree to be bound by the terms and provisions of this agreement. 
                If you do not agree to these terms, please do not use our service.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Description of Service</h2>
              <p className="text-muted-foreground">
                PixelSpido provides an AI-powered video content creation platform that helps users transform long-form 
                video content into short, shareable clips optimized for social media platforms.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">User Accounts</h2>
              <p className="text-muted-foreground mb-4">When you create an account, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account</li>
                <li>Not share your account credentials</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">User Content</h2>
              <p className="text-muted-foreground mb-4">
                You retain ownership of content you upload to PixelSpido. By uploading content, you grant us a license to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Process your videos for AI analysis</li>
                <li>Store and display your content</li>
                <li>Generate clips and derivatives</li>
                <li>Improve our services</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-primary" />
                Prohibited Uses
              </h2>
              <p className="text-muted-foreground mb-4">You may not use our service to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Upload illegal or copyrighted content without authorization</li>
                <li>Harass, abuse, or defame others</li>
                <li>Distribute malware or harmful content</li>
                <li>Attempt to gain unauthorized access</li>
                <li>Interfere with service operation</li>
                <li>Violate any applicable laws</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Payment & Billing</h2>
              <p className="text-muted-foreground mb-4">
                For paid plans, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Provide valid payment information</li>
                <li>Pay all charges in KES (Kenyan Shillings)</li>
                <li>authorise automatic renewal</li>
                <li>Contact us to dispute charges within 30 days</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Scale className="h-6 w-6 text-primary" />
                Disclaimer of Warranties
              </h2>
              <p className="text-muted-foreground">
                Our service is provided "as is" without warranties of any kind, express or implied. 
                We do not guarantee that the service will be error-free or uninterrupted.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Limitation of Liability</h2>
              <p className="text-muted-foreground">
                PixelSpido shall not be liable for any indirect, incidental, special, consequential, or punitive damages. 
                Our total liability shall not exceed the amount paid for the service in the past 12 months.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Termination</h2>
              <p className="text-muted-foreground">
                We may terminate your account for violation of these terms. You may cancel your subscription at any time 
                through your account settings.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
              <p className="text-muted-foreground">
                Questions about these terms? Contact us at{' '}
                <a href="mailto:legal@velocity.video" className="text-primary hover:underline">legal@velocity.video</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}