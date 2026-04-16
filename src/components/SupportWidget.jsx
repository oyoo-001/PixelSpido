import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import { showToast, showSuccess } from "@/lib/toast-utils";
import { MessageSquare, X, Send, Loader2, User, Bot, MessageCircle, HelpCircle, Paperclip, Image, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const faqData = [
  { question: "How do I upload a video?", answer: "Go to 'New Project' and drag & drop your video file. We support MP4, MOV, and AVI formats up to 2GB." },
  { question: "What social platforms can I export to?", answer: "You can export to TikTok, Instagram Reels, YouTube Shorts, Facebook, LinkedIn, and Twitter." },
  { question: "How does the free trial work?", answer: "New users get 7 days free trial with Pro features. No credit card required to start." },
  { question: "Can I cancel my subscription?", answer: "Yes, you can cancel anytime from Settings > Billing. You'll keep access until your billing period ends." },
];

const getFileIcon = (type) => {
  if (type?.startsWith('image/')) return Image;
  if (type?.includes('pdf')) return FileText;
  return Paperclip;
};

export default function SupportWidget() {
  const { user, isAuthenticated } = useAuth();
  const fileInputRef = useRef(null);
  
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("faq");
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [supportId, setSupportId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const startChat = async () => {
    const chatName = isAuthenticated ? (user?.name || name) : name;
    const chatEmail = isAuthenticated ? (user?.email || email) : email;
    
    if (!chatName?.trim() || !chatEmail?.trim()) {
      showToast({ error: "Name and email required" }, "Please enter your name and email");
      return;
    }
    
    setChatLoading(true);
    try {
      const data = await api.request('/support/start', { 
        method: 'POST', 
        body: JSON.stringify({ name: chatName, email: chatEmail }) 
      });
      
      setSupportId(data.conversation_id);
      setChatStarted(true);
      setMessages([
        { from: 'system', text: `👋 Hi ${chatName}! Welcome to PixelSpido Support.` },
        { from: 'system', text: 'Our team is online and ready to help. Describe your issue and we\'ll respond shortly.' },
      ]);
    } catch (error) {
      console.error("Start chat error:", error);
      showToast(error, "Failed to start chat");
    } finally {
      setChatLoading(false);
    }
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    const newAttachments = files.map(file => ({
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      name: file.name,
      size: file.size,
      type: file.type,
    }));
    
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const sendChatMessage = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && attachments.length === 0) || !supportId) return;
    
    const userMsg = newMessage;
    setNewMessage("");
    setAttachments([]);
    setMessages(prev => [...prev, { 
      from: 'user', 
      text: userMsg,
      attachments: attachments.map(a => ({ name: a.name, preview: a.preview, type: a.type }))
    }]);
    
    try {
      const formData = new FormData();
      formData.append('message', userMsg);
      attachments.forEach(att => formData.append('files', att.file));
      
      await api.request(`/support/${supportId}/message`, {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } catch (error) {
      console.error("Failed to send:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((isAuthenticated ? message.trim() : !name.trim() || !email.trim() || !message.trim())) return;
    
    setLoading(true);
    try {
      await api.request('/contact', {
        method: 'POST',
        body: JSON.stringify({ 
          name: isAuthenticated ? user.name : name, 
          email: isAuthenticated ? user.email : email, 
          subject: 'Support Request', 
          message 
        })
      });
      showSuccess("Message Sent!", "We'll get back to you soon.");
      setSubmitted(true);
    } catch (error) {
      showToast(error, "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const canStartChat = isAuthenticated 
    ? true 
    : (name.trim() && email.trim());
  
  const displayName = isAuthenticated ? (user?.name || "") : name;
  const displayEmail = isAuthenticated ? (user?.email || "") : email;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-primary to-purple-500 shadow-lg shadow-primary/25 flex items-center justify-center hover:scale-110 transition-transform z-50"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 w-[380px] h-[500px] bg-card rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden z-50">
          <div className="p-4 bg-gradient-to-r from-primary to-purple-500 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">PixelSpido Support</p>
                  <p className="text-xs text-white/70">We're here to help</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 hover:bg-white/10 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex border-b border-border">
            <button onClick={() => setActiveTab("faq")} className={`flex-1 py-3 flex items-center justify-center gap-2 text-sm font-medium transition-colors ${activeTab === "faq" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}>
              <HelpCircle className="h-4 w-4" /> FAQ
            </button>
            <button onClick={() => setActiveTab("live")} className={`flex-1 py-3 flex items-center justify-center gap-2 text-sm font-medium transition-colors ${activeTab === "live" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}>
              <MessageCircle className="h-4 w-4" /> Live Chat
            </button>
          </div>

          {activeTab === "faq" && (
            <>
              {submitted ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                  <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                    <Send className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Message Sent!</h3>
                  <p className="text-sm text-muted-foreground mb-6">We'll get back to you within 24 hours.</p>
                  <Button variant="outline" onClick={() => { setSubmitted(false); setMessage(""); }}>
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                  <div className="p-4 border-b border-border">
                    <p className="text-xs font-medium text-muted-foreground mb-2">COMMON QUESTIONS</p>
                    <div className="space-y-2">
                      {faqData.map((faq, i) => (
                        <details key={i} className="group">
                          <summary className="flex items-center gap-2 text-sm cursor-pointer list-none">
                            <span className="text-primary">•</span>
                            <span className="hover:text-primary transition-colors">{faq.question}</span>
                          </summary>
                          <p className="text-xs text-muted-foreground mt-1 pl-4">{faq.answer}</p>
                        </details>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                    <p className="text-xs font-medium text-muted-foreground">STILL NEED HELP?</p>
                    {!isAuthenticated && (
                      <>
                        <Input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
                        <Input type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                      </>
                    )}
                    <textarea placeholder="Describe your issue..." value={message} onChange={(e) => setMessage(e.target.value)} className="w-full h-24 px-3 py-2 text-sm rounded-lg border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary" required />
                  </div>

                  <div className="p-4 border-t border-border">
                    <Button type="submit" className="w-full" disabled={loading || !message || (!isAuthenticated && (!name || !email))}>
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4 mr-2" /> Send Message</>}
                    </Button>
                  </div>
                </form>
              )}
            </>
          )}

          {activeTab === "live" && (
            <>
              {!chatStarted ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6">
                  <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                    <MessageCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Live Support</h3>
                  <p className="text-sm text-muted-foreground text-center mb-6">Chat with our support team in real-time</p>
                  <div className="w-full space-y-3">
                    {!isAuthenticated ? (
                      <>
                        <Input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
                        <Input type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                      </>
                    ) : (
                      <p className="text-sm text-center text-muted-foreground py-2">
                        Starting chat as {displayName}
                      </p>
                    )}
                    <Button className="w-full" onClick={startChat} disabled={chatLoading}>
                      {chatLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Start Chat"}
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={sendChatMessage} className="flex-1 flex flex-col">
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-lg p-3 ${msg.from === 'user' ? 'bg-primary text-primary-foreground' : msg.from === 'system' ? 'bg-yellow-500/20 text-yellow-600 text-sm' : 'bg-secondary'}`}>
                          {msg.attachments?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                              {msg.attachments.map((att, j) => (
                                att.preview ? (
                                  <img key={j} src={att.preview} alt={att.name} className="w-20 h-20 object-cover rounded" />
                                ) : (
                                  <div key={j} className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded">
                                    <Paperclip className="h-3 w-3" /> {att.name}
                                  </div>
                                )
                              ))}
                            </div>
                          )}
                          {msg.text && <p className="text-sm">{msg.text}</p>}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  
                  <input type="file" ref={fileInputRef} onChange={handleFileSelect} multiple className="hidden" accept="image/*,.pdf,.doc,.docx,.txt" />
                  
                  {attachments.length > 0 && (
                    <div className="px-4 py-2 border-t border-border flex flex-wrap gap-2">
                      {attachments.map((att, i) => (
                        <div key={i} className="relative">
                          {att.preview ? (
                            <img src={att.preview} alt={att.name} className="w-12 h-12 object-cover rounded" />
                          ) : (
                            <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                              <FileText className="h-4 w-4" />
                            </div>
                          )}
                          <button type="button" onClick={() => removeAttachment(i)} className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white rounded-full text-xs">×</button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="p-4 border-t border-border">
                    <div className="flex gap-2">
                      <Button type="button" variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Input placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="flex-1" />
                      <Button type="submit" size="icon" disabled={(!newMessage.trim() && attachments.length === 0)}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}