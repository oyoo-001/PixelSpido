import { Link } from "react-router-dom";
import { Zap, Code, Key, Webhook, Shield, Zap as ZapIcon, Check, ArrowRight, Copy, CheckCircle, FileText, Book, Terminal, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Footer from "@/components/Footer";

const endpoints = [
  {
    category: "Authentication",
    items: [
      { method: "POST", path: "/api/auth/register", description: "Register a new user account" },
      { method: "POST", path: "/api/auth/login", description: "Log in and get JWT token" },
      { method: "POST", path: "/api/auth/google", description: "Authenticate with Google OAuth" },
    ],
  },
  {
    category: "Projects",
    items: [
      { method: "GET", path: "/api/projects", description: "List all projects for authenticated user" },
      { method: "POST", path: "/api/projects", description: "Create a new project" },
      { method: "GET", path: "/api/projects/:id", description: "Get project details" },
      { method: "PUT", path: "/api/projects/:id", description: "Update project" },
      { method: "DELETE", path: "/api/projects/:id", description: "Delete project" },
    ],
  },
  {
    category: "Segments",
    items: [
      { method: "GET", path: "/api/segments/:project_id", description: "List segments for a project" },
      { method: "POST", path: "/api/segments/analyze", description: "Analyze video with AI" },
      { method: "GET", path: "/api/segments/:id", description: "Get segment details" },
      { method: "DELETE", path: "/api/segments/:id", description: "Delete segment" },
    ],
  },
  {
    category: "Social Accounts",
    items: [
      { method: "GET", path: "/api/social-accounts", description: "List connected accounts" },
      { method: "POST", path: "/api/social-accounts/connect", description: "Connect OAuth account" },
      { method: "DELETE", path: "/api/social-accounts/:id", description: "Disconnect account" },
    ],
  },
  {
    category: "Subscription",
    items: [
      { method: "GET", path: "/api/subscription", description: "Get current subscription" },
      { method: "POST", path: "/api/payment/initialize", description: "Initialize Paystack payment" },
      { method: "POST", path: "/api/payment/verify", description: "Verify payment" },
    ],
  },
];

const codeExamples = {
  javascript: `// Initialize PixelSpido SDK
const pixelspido = new PixelSpidoClient({
  apiKey: 'your-api-key'
});

// Create a project
const project = await pixelspido.projects.create({
  title: 'My Video',
  niche: 'technology'
});

// Upload video
const upload = await pixelspido.projects.upload(project.id, {
  file: './video.mp4'
});

// Analyze with AI
const segments = await pixelspido.segments.analyze(project.id, {
  analysisType: 'viral_moments'
});

console.log(\`Found \${segments.length} segments\`);`,
  python: `# Initialize PixelSpido SDK
from pixelspido import PixelSpidoClient

client = PixelSpidoClient(api_key="your-api-key")

# Create a project
project = client.projects.create(
  title="My Video",
  niche="technology"
)

# Upload video
upload = client.projects.upload(project.id, file="./video.mp4")

# Analyze with AI
segments = client.segments.analyze(project.id, analysis_type="viral_moments")

print(f"Found {len(segments)} segments")`,
  curl: `# Register
curl -X POST https://api.velocity.video/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{"email":"user@example.com","password":"pass","name":"User"}'

# Create project
curl -X POST https://api.velocity.video/api/projects \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"title":"My Video","niche":"technology"}'

# Analyze video
curl -X POST https://api.velocity.video/api/segments/analyze \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"project_id":123,"analysis_type":"viral_moments"}'`,
};

const webhooks = [
  { event: "project.completed", description: "Video processing finished" },
  { event: "segment.created", description: "New AI-generated segment ready" },
  { event: "export.completed", description: "Video export finished" },
  { event: "publish.completed", description: "Post successfully published" },
  { event: "subscription.created", description: "New subscription created" },
  { event: "subscription.expired", description: "Subscription expired" },
];

export default function ApiDocs() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="absolute inset-0 bg-[radial_gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <Code className="h-4 w-4" />
              Developer API
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight">
              Build With the
              <span className="bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent">
                {" "}PixelSpido API
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful REST API with webhooks, SDKs, and full documentation. 
              Integrate video AI into your apps.
            </p>
            
            <div className="flex items-center justify-center gap-4">
              <Link to="/login">
                <Button size="lg" className="gap-2 h-12 px-8 text-base">
                  Get API Key <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="gap-2 h-12 px-8 text-base">
                <Book className="h-4 w-4" /> Read Docs
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-24 px-6 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Quick Start</h2>
            <p className="text-muted-foreground text-lg">Get started in minutes</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-card border border-border">
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                <Key className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">1. Get API Key</h3>
              <p className="text-muted-foreground text-sm">
                Create a PixelSpido account and generate your API key from the dashboard settings.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-card border border-border">
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                <Terminal className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">2. Install SDK</h3>
              <p className="text-muted-foreground text-sm">
                Install our SDK for your preferred language or use raw REST calls.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-card border border-border">
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">3. Make Requests</h3>
              <p className="text-muted-foreground text-sm">
                Start creating video projects and analyzing content with AI.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Code Examples</h2>
            <p className="text-muted-foreground text-lg">Use our SDKs or raw REST API</p>
          </div>
          
          <Tabs defaultValue="javascript" className="w-full">
            <TabsList className="mx-auto mb-6">
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="curl">cURL</TabsTrigger>
            </TabsList>
            
            {Object.entries(codeExamples).map(([lang, code]) => (
              <TabsContent key={lang} value={lang}>
                <div className="bg-secondary rounded-2xl p-6 overflow-x-auto">
                  <pre className="text-sm font-mono text-muted-foreground">
                    {code}
                  </pre>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Endpoints */}
      <section className="py-24 px-6 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">API Endpoints</h2>
            <p className="text-muted-foreground text-lg">Complete REST API reference</p>
          </div>
          
          {endpoints.map((category, i) => (
            <div key={i} className="mb-12">
              <h3 className="text-xl font-semibold mb-4">{category.category}</h3>
              <div className="space-y-2">
                {category.items.map((endpoint, j) => (
                  <div 
                    key={j}
                    className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border"
                  >
                    <span className={`px-2 py-1 rounded text-xs font-mono font-medium ${
                      endpoint.method === 'GET' ? 'bg-blue-500/20 text-blue-400' :
                      endpoint.method === 'POST' ? 'bg-green-500/20 text-green-400' :
                      endpoint.method === 'PUT' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {endpoint.method}
                    </span>
                    <code className="text-sm font-mono flex-1">{endpoint.path}</code>
                    <span className="text-muted-foreground text-sm">{endpoint.description}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Webhooks */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Webhooks</h2>
            <p className="text-muted-foreground text-lg">Real-time notifications for your app</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {webhooks.map((webhook) => (
              <div 
                key={webhook.event}
                className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border"
              >
                <Webhook className="h-5 w-5 text-primary" />
                <div>
                  <code className="text-sm font-mono">{webhook.event}</code>
                  <p className="text-xs text-muted-foreground">{webhook.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rate Limits */}
      <section className="py-24 px-6 bg-card/30">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 rounded-3xl bg-card border border-border">
            <div className="flex items-center gap-4 mb-6">
              <Shield className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-semibold">Rate Limits & Security</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Rate Limits</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 100 requests/minute (Starter)</li>
                  <li>• 1,000 requests/minute (Pro)</li>
                  <li>• Unlimited (Business)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Security</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• TLS 1.3 encryption</li>
                  <li>• API key authentication</li>
                  <li>• OAuth 2.0 support</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-primary/20 via-purple-500/20 to-accent/20 border border-primary/20 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Build?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Get your API key and start building amazing video experiences
            </p>
            <Link to="/login">
              <Button size="lg" className="gap-2 h-14 px-10 text-lg bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90">
                Get API Key <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}