import { Link } from "react-router-dom";
import { Zap, Search, Calendar, User, ArrowRight, Zap as ZapIcon, Sparkles, TrendingUp, Video, Share2, MessageSquare, Eye, Heart, ArrowRightCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

const posts = [
  {
    id: 1,
    title: "How AI is Revolutionizing Video Content Creation",
    excerpt: "Discover how artificial intelligence is making it easier than ever to create engaging video content for social media...",
    category: "AI & Technology",
    date: "April 10, 2026",
    author: "Sarah Chen",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
    readTime: "5 min read",
    likes: 234,
    views: 1523,
  },
  {
    id: 2,
    title: "10 Tips for Going Viral on TikTok in 2026",
    excerpt: "Learn the secrets to creating viral content that grabs attention in the first 3 seconds...",
    category: "Growth Tips",
    date: "April 5, 2026",
    author: "Marcus Johnson",
    image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&h=400&fit=crop",
    readTime: "8 min read",
    likes: 567,
    views: 3421,
  },
  {
    id: 3,
    title: "How to Repurpose YouTube Videos for Shorts and Reels",
    excerpt: "Transform your long-form content into viral shorts with these proven strategies...",
    category: "Tutorial",
    date: "March 28, 2026",
    author: "Emily Rodriguez",
    image: "https://images.unsplash.com/photo-1611162616305-c690b6a9b1f7?w=800&h=400&fit=crop",
    readTime: "6 min read",
    likes: 423,
    views: 2890,
  },
  {
    id: 4,
    title: "The Future of Social Media: Video-First Platforms",
    excerpt: "Why video content is dominating social media and how to adapt your strategy...",
    category: "Industry Trends",
    date: "March 15, 2026",
    author: "Alex Kimani",
    image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=800&h=400&fit=crop",
    readTime: "7 min read",
    likes: 891,
    views: 4521,
  },
  {
    id: 5,
    title: "PixelSpido vs Competitors: Which AI Video Tool is Best?",
    excerpt: "A comprehensive comparison of the top AI video editing tools in 2026...",
    category: "Product Comparison",
    date: "March 1, 2026",
    author: "Tech Reviewer",
    image: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=800&h=400&fit=crop",
    readTime: "10 min read",
    likes: 678,
    views: 5123,
  },
  {
    id: 6,
    title: "Getting Started with Video Marketing for Small Business",
    excerpt: "A beginner's guide to video marketing for small businesses with limited budgets...",
    category: "Marketing",
    date: "February 20, 2026",
    author: "Marketing Team",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52c?w=800&h=400&fit=crop",
    readTime: "12 min read",
    likes: 345,
    views: 2134,
  },
];

const categories = [
  "All Posts",
  "AI & Technology",
  "Growth Tips",
  "Tutorial",
  "Industry Trends",
  "Product Comparison",
  "Marketing",
];

export default function Blog() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="absolute inset-0 bg-[radial_gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        
        <div className="relative max-w-6xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
            <ZapIcon className="h-4 w-4" />
            Blog
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
            Latest
            <span className="bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent">
              {" "}Updates
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            Tips, tutorials, and insights on video content creation and social media growth.
          </p>
        </div>
      </section>

      {/* Search & Categories */}
      <section className="py-8 px-6 border-b border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    category === "All Posts"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search posts..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-secondary border-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-card border border-border">
            <div className="grid md:grid-cols-2">
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium mb-4 w-fit">
                  Featured
                </span>
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                  {posts[0].title}
                </h2>
                <p className="text-muted-foreground mb-6">{posts[0].excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" /> {posts[0].date}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" /> {posts[0].author}
                  </span>
                  <span>{posts[0].readTime}</span>
                </div>
                <Button className="w-fit gap-2">
                  Read Article <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="hidden md:block">
                <img 
                  src={posts[0].image} 
                  alt={posts[0].title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12 px-6 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.slice(1).map((post) => (
              <article 
                key={post.id}
                className="group rounded-2xl bg-card border border-border overflow-hidden hover:border-primary/50 transition-all"
              >
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium text-primary">{post.category}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{post.readTime}</span>
                  </div>
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{post.date}</span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" /> {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" /> {post.views}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-primary/20 via-purple-500/20 to-accent/20 border border-primary/20 text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Get the latest tips and insights delivered to your inbox every week.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl bg-background border border-border"
              />
              <Button className="gap-2">
                Subscribe <ArrowRightCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}