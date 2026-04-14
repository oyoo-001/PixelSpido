import { useState } from "react";
import { showToast, showSuccess } from "@/lib/toast-utils";
import { Zap, Send, MapPin, Mail, Phone, MessageSquare, Zap as ZapIcon, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Footer from "@/components/Footer";

const contactInfo = [
  { icon: MapPin, label: "Location", value: "Nairobi, Kenya" },
  { icon: Mail, label: "Email", value: "hello@pixelspido.com" },
  { icon: Phone, label: "Phone", value: "+254 700 000 000" },
  { icon: MessageSquare, label: "Support", value: "support@pixelspido.com" },
];

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      showToast({ error: "Please fill in all required fields" }, "Missing information");
      return;
    }
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      setSuccess(true);
      showSuccess("Message Sent!", "We'll get back to you within 24 hours.");
    } catch (error) {
      showToast(error, "Failed to send message");
      console.error("Contact form error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="absolute inset-0 bg-[radial_gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <ZapIcon className="h-4 w-4" />
              Contact Us
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
              Get in
              <span className="bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent">
                {" "}Touch
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll get back to you as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="p-8 rounded-3xl bg-card border border-border">
                <h2 className="text-2xl font-bold mb-6">Contact Info</h2>
                <div className="space-y-6">
                  {contactInfo.map((info, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                        <info.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{info.label}</p>
                        <p className="font-medium">{info.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-gradient-to-br from-primary/20 via-purple-500/20 to-accent/20 border border-primary/20">
                <h3 className="font-semibold mb-2">Need urgent help?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Check our help center or email support for priority assistance.
                </p>
                <Button variant="outline" className="w-full">
                  Visit Help Center
                </Button>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="p-8 rounded-3xl bg-card border border-border">
                {success ? (
                  <div className="text-center py-12">
                    <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground mb-6">
                      Thank you for reaching out. We'll get back to you within 24 hours.
                    </p>
                    <Button onClick={() => setSuccess(false)} variant="outline">
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          placeholder="Your name"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="How can we help?"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us more about your question or feedback..."
                        rows={6}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full gap-2" disabled={loading}>
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      {loading ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-16 px-6 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-3xl bg-card border border-border overflow-hidden">
            <div className="aspect-video lg:aspect-[3/1] bg-secondary flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nairobi, Kenya</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}