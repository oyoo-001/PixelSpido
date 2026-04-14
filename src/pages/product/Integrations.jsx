import { Link } from "react-router-dom";
import { Zap, Globe, Video, MessageSquare, Mail, Cloud, Code, Database, Shield, Zap as ZapIcon, Check, ArrowRight, Layers, Network, Plug, ArrowRightCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

const socialPlatforms = [
  { name: "TikTok", color: "#FE2C55", connected: true, description: "Automatically post clips to TikTok with optimal timestamps." },
  { name: "Instagram", color: "#E4405F", connected: true, description: "Post to Reels and Feed. Native aspect ratios and hashtags." },
  { name: "YouTube", color: "#FF0000", connected: true, description: "Upload Shorts with custom thumbnails and descriptions." },
  { name: "Facebook", color: "#1877F2", connected: true, description: "Post to Pages, Groups, and Stories simultaneously." },
  { name: "LinkedIn", color: "#0A66C2", connected: true, description: "Professional content optimized for B2B engagement." },
  { name: "Twitter/X", color: "#000000", connected: false, description: "Share clips as native videos with auto-generated captions." },
  { name: "Snapchat", color: "#FFFC00", connected: false, description: "Create and schedule Snap ads and stories." },
  { name: "Pinterest", color: "#BD081C", connected: false, description: "Convert video highlights into engaging Pins." },
];

const tools = [
  { name: "Canva", icon: Layers, connected: true, description: "Edit clips in Canva and sync back automatically." },
  { name: "Adobe Premiere", icon: Video, connected: false, description: "Export projects directly to Premiere Pro." },
  { name: "Final Cut Pro", icon: Video, connected: false, description: "Native FCPXML export for professional editors." },
  { name: "Slack", icon: MessageSquare, connected: false, description: "Get notifications when exports complete." },
  { name: "Zapier", icon: Plug, connected: false, description: "Connect 5,000+ apps with no-code automation." },
  { name: "Google Drive", icon: Cloud, connected: false, description: "Auto-backup your video library to Drive." },
];

const storagePlatforms = [
  { name: "AWS S3", icon: Database, connected: true },
  { name: "Google Cloud Storage", icon: Cloud, connected: false },
  { name: "Cloudflare R2", icon: Cloud, connected: false },
  { name: "Backblaze B2", icon: Database, connected: false },
];

export default function Integrations() {
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
              Integrations
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight">
              Connect Your
              <span className="bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent">
                {" "}Favorite Tools
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Seamlessly integrate with the tools you already use. 
              Connect once, post everywhere — all from one platform.
            </p>
          </div>
        </div>
      </section>

      {/* Social Platforms */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Social Platforms</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Connect your social accounts and post directly from PixelSpido
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {socialPlatforms.map((platform) => (
              <div 
                key={platform.name}
                className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="h-12 w-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: platform.color + '20' }}
                  >
                    <Globe className="h-6 w-6" style={{ color: platform.color }} />
                  </div>
                  {platform.connected ? (
                    <span className="flex items-center gap-1 text-xs text-green-500">
                      <Check className="h-3 w-3" /> Connected
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Not connected</span>
                  )}
                </div>
                <h3 className="font-semibold mb-2">{platform.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{platform.description}</p>
                <Button variant={platform.connected ? "outline" : "default"} size="sm" className="w-full">
                  {platform.connected ? "Manage" : "Connect"} <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Creative Tools */}
      <section className="py-24 px-6 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Creative Tools</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Connect your favorite editing and productivity tools
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <div 
                key={tool.name}
                className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center">
                    <tool.icon className="h-6 w-6" />
                  </div>
                  {tool.connected ? (
                    <span className="flex items-center gap-1 text-xs text-green-500">
                      <Check className="h-3 w-3" /> Connected
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Available</span>
                  )}
                </div>
                <h3 className="font-semibold mb-2">{tool.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
                <Button variant={tool.connected ? "outline" : "default"} size="sm" className="w-full">
                  {tool.connected ? "Manage" : "Connect"} <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Storage */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Storage & Cloud</h2>
            <p className="text-muted-foreground text-lg">Connect your preferred cloud storage</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {storagePlatforms.map((platform) => (
              <div 
                key={platform.name}
                className="p-6 rounded-2xl bg-card border border-border text-center"
              >
                <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-4">
                  <platform.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">{platform.name}</h3>
                {platform.connected && (
                  <span className="flex items-center justify-center gap-1 text-xs text-green-500">
                    <Check className="h-3 w-3" /> Connected
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zapier */}
      <section className="py-24 px-6 bg-card/30">
        <div className="max-w-4xl mx-auto">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-orange-500/20 to-primary/20 border border-orange-500/30">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="h-16 w-16 rounded-2xl bg-orange-500 flex items-center justify-center mb-6">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">5,000+ Apps with Zapier</h3>
                <p className="text-muted-foreground mb-6">
                  Connect PixelSpido to 5,000+ apps through Zapier. 
                  Automate your workflow with triggers and actions.
                </p>
                <Button className="bg-orange-500 hover:bg-orange-600">
                  Connect Zapier <ArrowRightCircle className="h-4 w-4 ml-2" />
                </Button>
              </div>
              <div className="hidden md:block text-muted-foreground text-sm">
                <ul className="space-y-2">
                  <li>• 2,000+ video apps</li>
                  <li>• Social media tools</li>
                  <li>• Marketing platforms</li>
                  <li>• CRM integrations</li>
                  <li>• Email marketing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* API */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="p-12 rounded-3xl bg-card border border-border">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
                  <Code className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Custom Integrations</h3>
                <p className="text-muted-foreground mb-6">
                  Build custom integrations with our REST API. 
                  Webhooks, SDKs, and full documentation included.
                </p>
                <Link to="/api-docs">
                  <Button variant="outline">
                    View API Docs <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="w-full md:w-auto">
                <div className="bg-secondary rounded-xl p-4 font-mono text-sm">
                  <pre className="text-muted-foreground">
{`// Example API call
const video = await velocity.videos.create({
  file: uploadedFile,
  niche: "tech"
});

// AI analysis
const segments = await video.analyze();`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-primary/20 via-purple-500/20 to-accent/20 border border-primary/20">
            <h2 className="text-3xl font-bold mb-4">Don't See Your Tool?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              We're constantly adding new integrations. Let us know what tools you need.
            </p>
            <Link to="/contact">
              <Button size="lg" className="gap-2">
                Request Integration <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}