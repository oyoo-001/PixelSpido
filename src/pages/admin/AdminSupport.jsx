import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import { showToast, showSuccess } from "@/lib/toast-utils";
import { Search, Loader2, Send, User, MessageSquare, X, Phone, Video, Paperclip, Image as ImageIcon, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SupportPopup from "@/components/SupportPopup";

export default function AdminSupport() {
  const fileInputRef = useRef(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [popupConv, setPopupConv] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
      const chatInterval = setInterval(() => loadMessages(selectedConversation.id), 3000);
      return () => clearInterval(chatInterval);
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    try {
      const data = await api.request('/admin/support/conversations');
      setConversations(data);
      
      const pending = data.find(c => c.status === 'pending');
      if (pending && (!popupConv || popupConv.id !== pending.id)) {
        setPopupConv(pending);
      }
    } catch (error) {
      console.error("Load conv error:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const data = await api.request(`/admin/support/conversations/${conversationId}/messages`);
      setSelectedConversation(prev => prev?.id === conversationId ? { ...prev, messages: data.messages || [] } : prev);
    } catch (error) {
      console.error("Load msg error:", error);
    }
  };

  const handleAccept = async (conv) => {
    try {
      await api.request(`/admin/support/conversations/${conv.id}/accept`, { method: 'POST' });
      setSelectedConversation(conv);
      loadConversations();
    } catch (error) {
      showToast(error, "Failed to accept");
    }
    setPopupConv(null);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      name: file.name,
      type: file.type,
    }));
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedConversation) return;
    
    setSending(true);
    try {
      await api.request(`/admin/support/conversations/${selectedConversation.id}/message`, {
        method: 'POST',
        body: JSON.stringify({ message: message.trim() })
      });
      setMessage("");
      loadMessages(selectedConversation.id);
      loadConversations();
    } catch (error) {
      showToast(error, "Failed to send");
    } finally {
      setSending(false);
    }
  };

  const filteredConvs = conversations.filter(conv =>
    conv.name?.toLowerCase().includes(search.toLowerCase()) ||
    conv.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <SupportPopup conversation={popupConv} onClose={() => setPopupConv(null)} onAccept={handleAccept} />
      
      <div className="max-w-6xl mx-auto p-6 lg:p-8 bg-background min-h-screen">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Support</h1>
          <p className="text-muted-foreground mt-1">Real-time chat support</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Conversations Sidebar */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
              </div>
            </div>
            <div className="overflow-y-auto max-h-[70vh]">
              {loading ? (
                <div className="p-8 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>
              ) : filteredConvs.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">No conversations</div>
              ) : (
                filteredConvs.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => handleAccept(conv)}
                    className={`p-4 border-b border-border cursor-pointer hover:bg-secondary/50 transition-colors ${
                      selectedConversation?.id === conv.id ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">{conv.name}</p>
                          {conv.status === 'pending' && (
                            <span className="h-2 w-2 rounded-full bg-yellow-500" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{conv.last_message}</p>
                        <p className="text-xs text-muted-foreground">{conv.last_message_at}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area - WhatsApp Style */}
          <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden flex flex-col h-[80vh]">
            {selectedConversation ? (
              <>
                <div className="p-4 border-b border-border bg-gradient-to-r from-primary/10 to-purple-500/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{selectedConversation.name}</p>
                        <p className="text-xs text-muted-foreground">{selectedConversation.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost"><Phone className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost"><Video className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </div>

                <input type="file" ref={fileInputRef} onChange={handleFileSelect} multiple className="hidden" accept="image/*,.pdf,.doc,.docx,.txt" />
                
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {selectedConversation.messages?.map((msg, i) => (
                    <div key={i} className={`flex ${msg.from_user ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-lg p-3 shadow-sm ${
                        msg.from_user
                          ? 'bg-[#d9fdd3] text-black rounded-br-none'
                          : 'bg-white text-black rounded-bl-none'
                      }`}>
                        {msg.attachment_url && (
                          msg.attachment_url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                            <img src={msg.attachment_url} alt="attachment" className="w-full max-w-[200px] rounded mb-2" />
                          ) : (
                            <div className="flex items-center gap-2 text-xs bg-black/10 p-2 rounded mb-2">
                              <FileText className="h-4 w-4" /> {msg.attachment_name || 'Attachment'}
                            </div>
                          )
                        )}
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-[10px] mt-1 text-black/50">{msg.created_at}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {attachments.length > 0 && (
                  <div className="px-4 py-2 border-t border-b bg-muted/30 flex flex-wrap gap-2">
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

                <form onSubmit={handleSend} className="p-4 border-t border-border bg-background">
                  <div className="flex gap-2 bg-muted rounded-full px-4 py-2">
                    <Button type="button" variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Type a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="flex-1 bg-transparent border-0 focus:ring-0"
                    />
                    <Button type="submit" size="icon" variant="ghost" disabled={sending || !message.trim()}>
                      <Send className="h-4 w-4 text-primary" />
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center text-muted-foreground">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">Select a conversation</p>
                  <p className="text-sm">Choose from the sidebar to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}