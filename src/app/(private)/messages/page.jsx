"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Handshake,
  Heart,
  MessageSquare,
  Paperclip,
  Search,
  Send,
  Smile,
  User,
  Loader2,
  Check,
  CheckCheck,
} from "lucide-react";
import { toast } from "sonner";

import { SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { messaging } from "@/lib/api";
import { useUnreadMessages } from "@/contexts/UnreadMessagesContext";

export default function MessagesPage() {
  const { user, loading } = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setUnreadCount } = useUnreadMessages();

  const [threads, setThreads] = useState([]);
  const [messagesByThread, setMessagesByThread] = useState({});
  const [selectedThreadId, setSelectedThreadId] = useState(null);
  const [messageDraft, setMessageDraft] = useState("");
  const [activeView, setActiveView] = useState("list"); // list | thread
  const [isDesktop, setIsDesktop] = useState(false);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [unreadTotal, setUnreadTotal] = useState(0);

  // Fetch threads on mount
  useEffect(() => {
    if (loading) return;
    if (!user) {
      toast.error("Vous devez être connecté pour accéder à cette page.");
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    const fetchThreads = async () => {
      try {
        setLoadingThreads(true);
        const response = await messaging.getThreads();
        let threadsList = response.results || [];
        
        // Store total unread messages count
        const total = response.unread_messages_total || 0;
        setUnreadTotal(total);
        setUnreadCount(total); // Update global context
        
        // Check if there's a thread ID in URL params
        const threadId = searchParams.get('thread');
        if (threadId) {
          // Check if thread exists in the list
          const threadExists = threadsList.some(t => t.id === threadId);
          
          if (!threadExists) {
            // Thread doesn't exist in list (newly created), fetch it individually
            try {
              const messages = await messaging.getMessages(threadId);
              // Get thread info from messages or create a minimal thread object
              const firstMessage = Array.isArray(messages) ? messages[0] : null;
              
              // Create a thread object for the new thread
              const newThread = {
                id: threadId,
                created_at: firstMessage?.created_at || new Date().toISOString(),
                updated_at: firstMessage?.created_at || new Date().toISOString(),
                unread_messages_count: 0,
                last_message: firstMessage || null,
                // Add any other thread properties from the message context
                agent: firstMessage?.agent || null,
                athlete: firstMessage?.athlete || null,
                collaborator: firstMessage?.collaborator || null,
              };
              
              // Add the new thread to the beginning of the list
              threadsList = [newThread, ...threadsList];
            } catch (error) {
              console.error("Failed to fetch new thread:", error);
              // Continue anyway - the thread might still work
            }
          }
          
          // Set threads list (with or without the new thread)
          setThreads(threadsList);
          
          // Open the specified thread
          setSelectedThreadId(threadId);
          setActiveView("thread");
        } else {
          // No thread in URL, just set the threads list
          setThreads(threadsList);
        }
        // Don't auto-select first thread - show empty state instead
      } catch (error) {
        console.error("Failed to fetch threads:", error);
        toast.error("Impossible de charger les conversations");
      } finally {
        setLoadingThreads(false);
      }
    };

    fetchThreads();
  }, [user, loading, router, pathname, setUnreadCount, searchParams]);

  // Helper function to check if a message belongs to the current user
  const isMessageFromCurrentUser = useCallback((message) => {
    if (!message || !user?.id) return false;
    return (
      message.sender_id === user.id ||
      message.sender === user.id ||
      message.user_id === user.id ||
      message.from_user_id === user.id ||
      message.created_by === user.id ||
      message.author_id === user.id ||
      message.author === user.id
    );
  }, [user?.id]);

  // Fetch messages when thread is selected
  useEffect(() => {
    if (!selectedThreadId) return;

    const fetchMessages = async () => {
      try {
        setLoadingMessages(true);
        const response = await messaging.getMessages(selectedThreadId);
        // Normalize response - could be array or object with results
        const messages = Array.isArray(response) 
          ? response 
          : (response?.results || response?.data || []);
        
        setMessagesByThread((prev) => ({
          ...prev,
          [selectedThreadId]: messages,
        }));

        // Mark unread messages as read - only mark messages NOT sent by current user
        const unreadMessages = messages.filter(msg => !msg.is_read && !isMessageFromCurrentUser(msg));
        if (unreadMessages.length > 0) {
          const unreadCount = unreadMessages.length;
          
          // Mark messages as read in the API
          for (const message of unreadMessages) {
            try {
              await messaging.markMessageAsRead(message.id, true);
            } catch (error) {
              console.error("Failed to mark message as read:", error);
            }
          }

          // Update local state to reflect read status
          setMessagesByThread((prev) => ({
            ...prev,
            [selectedThreadId]: prev[selectedThreadId]?.map(msg => 
              unreadMessages.some(um => um.id === msg.id) 
                ? { ...msg, is_read: true } 
                : msg
            ) || messages,
          }));

          // Update thread's unread count
          setThreads((prev) => 
            prev.map(t => 
              t.id === selectedThreadId 
                ? { ...t, unread_messages_count: 0 }
                : t
            )
          );

          // Decrement total unread count
          setUnreadTotal((prev) => {
            const newTotal = Math.max(0, prev - unreadCount);
            setUnreadCount(newTotal); // Update global context
            return newTotal;
          });
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
        toast.error("Impossible de charger les messages");
      } finally {
        setLoadingMessages(false);
      }
    };

    if (!messagesByThread[selectedThreadId]) {
      fetchMessages();
    }
  }, [selectedThreadId, messagesByThread, user?.id, isMessageFromCurrentUser, setUnreadCount]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (isDesktop) {
      setActiveView("thread");
    } else if (!selectedThreadId) {
      setActiveView("list");
    }
  }, [isDesktop, selectedThreadId]);

  const selectedThread = useMemo(
    () => threads.find((t) => t.id === selectedThreadId) ?? null,
    [threads, selectedThreadId]
  );

  const messages = messagesByThread[selectedThreadId] || [];

  const sendMessage = useCallback(async () => {
    const trimmed = messageDraft.trim();
    if (!trimmed || !selectedThreadId || sending) return;

    try {
      setSending(true);
      const newMessage = await messaging.sendMessage(selectedThreadId, {
        content: trimmed,
      });

      // Add the new message to the local state
      setMessagesByThread((prev) => {
        const currentMessages = prev[selectedThreadId];
        // Ensure currentMessages is an array
        const messagesArray = Array.isArray(currentMessages) ? currentMessages : [];
        
        return {
          ...prev,
          [selectedThreadId]: [...messagesArray, newMessage],
        };
      });

      setMessageDraft("");
      toast.success("Message envoyé");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Impossible d'envoyer le message");
    } finally {
      setSending(false);
    }
  }, [messageDraft, selectedThreadId, sending]);

  if (!user) return null;

  if (loadingThreads) {
    return (
      <SidebarInset className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Chargement des conversations...</p>
        </div>
      </SidebarInset>
    );
  }

  if (!user) return null;

  return (
    <SidebarInset className="flex min-h-screen flex-col">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 lg:px-6">
        {isDesktop ? (
          <div className="grid h-[calc(100vh-8rem)] min-w-0 gap-6 lg:grid-cols-[360px_1fr]">
            <ConversationList
              threads={threads}
              selectedId={selectedThreadId}
              onSelect={(id) => setSelectedThreadId(id)}
              currentUser={user}
            />
            <Thread
              thread={selectedThread}
              messages={messages}
              messageDraft={messageDraft}
              onDraftChange={setMessageDraft}
              onSend={sendMessage}
              loading={loadingMessages}
              sending={sending}
              currentUserId={user?.id}
              currentUser={user}
            />
          </div>
        ) : (
          <div className="relative h-[calc(100vh-12rem)] overflow-hidden">
            <motion.div
              className="flex h-full"
              animate={{ x: activeView === "list" ? "0%" : "-100%" }}
              transition={{ type: "spring", stiffness: 240, damping: 30 }}
            >
              <div className="h-full min-w-full flex-shrink-0">
                <ConversationList
                  threads={threads}
                  selectedId={selectedThreadId}
                  onSelect={(id) => {
                    setSelectedThreadId(id);
                    setActiveView("thread");
                  }}
                  currentUser={user}
                  mobile
                />
              </div>
              <div className="h-full min-w-full max-w-full flex-shrink-0">
                <Thread
                  thread={selectedThread}
                  messages={messages}
                  messageDraft={messageDraft}
                  onDraftChange={setMessageDraft}
                  onSend={sendMessage}
                  onBack={() => setActiveView("list")}
                  loading={loadingMessages}
                  sending={sending}
                  currentUserId={user?.id}
                  currentUser={user}
                  isMobile
                />
              </div>
            </motion.div>
          </div>
        )}
      </div>

      <MobileNavigation pathname={pathname} />
    </SidebarInset>
  );
}

function ConversationList({ threads, selectedId, onSelect, currentUser, mobile = false }) {
  // Detect if current user is an agent (they have user_email that matches agent.user_email)
  const isAgent = (thread) => {
    return thread.agent && currentUser?.email === thread.agent.user_email;
  };

  // Detect if current user is a collaborator
  // If I'm not the agent and there's a collaborator, then I'm the collaborator
  const isCollaborator = (thread) => {
    if (!thread.collaborator) return false;
    // If I'm the agent, I'm not the collaborator
    if (isAgent(thread)) return false;
    // Otherwise, I'm the collaborator
    return true;
  };

  // Helper to get display name from thread
  const getThreadName = (thread) => {
    // If I'm an agent: show collaborator name
    if (isAgent(thread) && thread.collaborator) {
      if (thread.collaborator.first_name && thread.collaborator.last_name) {
        return `${thread.collaborator.first_name} ${thread.collaborator.last_name}`;
      }
      return thread.collaborator.user_email;
    }
    
    // If I'm a collaborator: show athlete name
    if (isCollaborator(thread) && thread.athlete) {
      return thread.athlete.full_name;
    }
    
    // Fallbacks
    if (thread.athlete) return thread.athlete.full_name;
    if (thread.agent) return thread.agent.name;
    if (thread.collaborator) {
      if (thread.collaborator.first_name && thread.collaborator.last_name) {
        return `${thread.collaborator.first_name} ${thread.collaborator.last_name}`;
      }
      return thread.collaborator.user_email;
    }
    return "Conversation";
  };

  // Helper to get subtitle
  const getSubtitle = (thread) => {
    // If I'm an agent: show collaborator's organisation
    if (isAgent(thread) && thread.collaborator?.organisation_name) {
      return thread.collaborator.organisation_name;
    }
    
    // If I'm a collaborator: show representing agent
    if (isCollaborator(thread) && thread.agent) {
      return `Représenté par ${thread.agent.name}`;
    }
    
    return null;
  };

  // Helper to get sport badge (only for collaborators viewing athletes)
  const getSportBadge = (thread) => {
    if (isCollaborator(thread) && thread.athlete?.sport_emoji) {
      return thread.athlete.sport_emoji;
    }
    return null;
  };

  // Helper to get initials for fallback
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Helper to get avatar
  const getThreadAvatar = (thread) => {
    // If I'm an agent: show collaborator's avatar
    if (isAgent(thread) && thread.collaborator?.avatar) {
      return thread.collaborator.avatar;
    }
    
    // If I'm a collaborator: show athlete's avatar
    if (isCollaborator(thread) && thread.athlete?.avatar) {
      return thread.athlete.avatar;
    }
    
    // Fallback to generated avatar
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(getThreadName(thread))}&background=random`;
  };

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 24) {
      return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
  };

  return (
    <CardWrapper className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
        <h2 className="text-sm font-semibold">Conversations</h2>
        <span className="text-xs text-muted-foreground">{threads.length}</span>
      </div>
      <ScrollArea className="flex-1 px-1">
        {threads.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-1 px-3 pb-3">
            {threads.map((thread) => {
              const name = getThreadName(thread);
              const subtitle = getSubtitle(thread);
              const sportBadge = getSportBadge(thread);
              // Check multiple fields for unread status
              const hasUnread = thread.unread_count > 0 || 
                               thread.has_unread || 
                               thread.unread_messages_count > 0 ||
                               thread.is_unread;
              return (
                <button
                  key={thread.id}
                  onClick={() => onSelect(thread.id)}
                  className={`relative flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-3 text-left transition hover:border-border/60 ${
                    selectedId === thread.id ? "bg-muted/60" : "bg-card"
                  }`}
                >
                  <div className="relative">
                    <Avatar className="h-11 w-11 border border-border/60">
                      <AvatarImage src={getThreadAvatar(thread)} alt={name} />
                      <AvatarFallback className="bg-muted text-foreground">
                        {getInitials(name)}
                      </AvatarFallback>
                    </Avatar>
                    {sportBadge && (
                      <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-card text-xs ring-2 ring-card">
                        {sportBadge}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {subtitle || formatDate(thread.last_message_at)}
                    </p>
                  </div>
                  {hasUnread && thread.unread_messages_count > 0 && (
                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-medium text-white">
                      {thread.unread_messages_count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </CardWrapper>
  );
}

function Thread({ thread, messages, messageDraft, onDraftChange, onSend, onBack, loading, sending, currentUserId, currentUser, isMobile = false }) {
  const messagesEndRef = useRef(null);
  const scrollAreaViewportRef = useRef(null);

  // Detect if current user is an agent
  const isAgent = (thread) => {
    return thread?.agent && currentUser?.email === thread.agent.user_email;
  };

  // Detect if current user is a collaborator
  // If I'm not the agent and there's a collaborator, then I'm the collaborator
  const isCollaborator = (thread) => {
    if (!thread?.collaborator) return false;
    // If I'm the agent, I'm not the collaborator
    if (isAgent(thread)) return false;
    // Otherwise, I'm the collaborator
    return true;
  };

  // Helper to get display name from thread
  const getThreadName = (thread) => {
    if (!thread) return "";
    
    // If I'm an agent: show collaborator name
    if (isAgent(thread) && thread.collaborator) {
      if (thread.collaborator.first_name && thread.collaborator.last_name) {
        return `${thread.collaborator.first_name} ${thread.collaborator.last_name}`;
      }
      return thread.collaborator.user_email;
    }
    
    // If I'm a collaborator: show athlete name
    if (isCollaborator(thread) && thread.athlete) {
      return thread.athlete.full_name;
    }
    
    // Fallbacks
    if (thread.athlete) return thread.athlete.full_name;
    if (thread.agent) return thread.agent.name;
    if (thread.collaborator) {
      if (thread.collaborator.first_name && thread.collaborator.last_name) {
        return `${thread.collaborator.first_name} ${thread.collaborator.last_name}`;
      }
      return thread.collaborator.user_email;
    }
    return "Conversation";
  };

  // Helper to get subtitle for thread header
  const getThreadSubtitle = (thread) => {
    if (!thread) return "";
    
    // If I'm an agent: show collaborator's organisation
    if (isAgent(thread) && thread.collaborator?.organisation_name) {
      return thread.collaborator.organisation_name;
    }
    
    // If I'm a collaborator: show representing agent
    if (isCollaborator(thread) && thread.agent) {
      return `Représenté par ${thread.agent.name}`;
    }
    
    return "";
  };

  // Helper to get initials for fallback
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Helper to get avatar
  const getThreadAvatar = (thread) => {
    if (!thread) return "";
    
    // If I'm an agent: show collaborator's avatar
    if (isAgent(thread) && thread.collaborator?.avatar) {
      return thread.collaborator.avatar;
    }
    
    // If I'm a collaborator: show athlete's avatar
    if (isCollaborator(thread) && thread.athlete?.avatar) {
      return thread.athlete.avatar;
    }
    
    // Fallback to generated avatar
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(getThreadName(thread))}&background=random`;
  };

  // Helper to format time
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  };

  // Determine if message is from current user
  // Try multiple fields to identify the sender
  const isMyMessage = (message) => {
    if (!message || !currentUserId) return false;
    
    // Debug: log message structure (remove this after debugging)
    if (messages.length > 0 && messages[0] === message) {
      console.log("Message structure:", message);
      console.log("Current user ID:", currentUserId);
    }
    
    // Check various possible field names for sender
    return (
      message.sender_id === currentUserId ||
      message.sender === currentUserId ||
      message.user_id === currentUserId ||
      message.from_user_id === currentUserId ||
      message.created_by === currentUserId ||
      message.author_id === currentUserId ||
      message.author === currentUserId
    );
  };

  const threadName = getThreadName(thread);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    // Scroll the ScrollArea viewport to bottom
    if (scrollAreaViewportRef.current) {
      const viewport = scrollAreaViewportRef.current;
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages]);

  // Empty state when no thread is selected
  if (!thread) {
    return (
      <CardWrapper className="flex h-full max-h-full min-w-0 flex-col items-center justify-center overflow-hidden">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-muted p-4">
            <MessageSquare className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Bienvenue dans votre messagerie</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Sélectionnez une conversation dans la liste pour commencer à échanger.
            </p>
          </div>
        </div>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper className="flex h-full max-h-full min-w-0 flex-col overflow-hidden">
      <div className="flex flex-shrink-0 items-center gap-3 border-b border-border/60 px-5 py-4">
        {isMobile ? (
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        ) : null}
        <Avatar className="h-10 w-10 border border-border/60">
          <AvatarImage src={getThreadAvatar(thread)} alt={threadName} />
          <AvatarFallback className="bg-muted text-foreground">
            {getInitials(threadName)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold leading-tight">{threadName}</p>
          {getThreadSubtitle(thread) && (
            <p className="text-xs font-medium text-muted-foreground">
              {getThreadSubtitle(thread)}
            </p>
          )}
        </div>
      </div>

      <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden">
        <div 
          ref={scrollAreaViewportRef}
          className="h-full w-full overflow-y-auto px-5 scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="w-full space-y-3 py-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Chargement des messages...</p>
              </div>
            ) : thread ? (
              messages.length > 0 ? (
                <>
                  {messages.map((msg) => {
                    const isMine = isMyMessage(msg);
                    return (
                      <div key={msg.id} className={`flex w-full min-w-0 ${isMine ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`w-fit max-w-[80%] min-w-0 rounded-2xl px-3 py-2 text-sm shadow-sm ${
                            isMine
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground"
                          }`}
                          style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                        >
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                          <div
                            className={`mt-1 flex items-center gap-1 text-[10px] ${
                              isMine ? "opacity-80" : "text-muted-foreground"
                            }`}
                          >
                            <span>{formatTime(msg.created_at)}</span>
                            {isMine && (
                              <>
                                {msg.is_read ? (
                                  <CheckCheck className="h-3 w-3" />
                                ) : (
                                  <Check className="h-3 w-3" />
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {/* Auto-scroll anchor */}
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                  <MessageSquare className="mb-2 h-10 w-10 opacity-70" />
                  <p className="text-sm font-medium">Démarrez la discussion</p>
                  <p className="text-xs">Écrivez votre premier message.</p>
                </div>
              )
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 border-t border-border/60 px-5 py-3">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Textarea
              rows={2}
              placeholder="Écrire un message..."
              value={messageDraft}
              onChange={(event) => onDraftChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  onSend();
                }
              }}
              disabled={sending || !thread}
              className="min-h-[64px] resize-none"
            />
          </div>
          <div className="flex items-center gap-1">
            <Button 
              onClick={onSend} 
              disabled={sending || !thread || !messageDraft.trim()}
              className="h-9 px-4"
            >
              {sending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Envoyer
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </CardWrapper>
  );
}

function CardWrapper({ children, className = "" }) {
  return (
    <div className={`min-w-0 rounded-2xl border border-border/80 bg-card shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
      <MessageSquare className="mb-2 h-10 w-10 opacity-70" />
      <p className="text-sm font-medium">Aucune conversation</p>
      <p className="text-xs">Démarrez une nouvelle discussion.</p>
    </div>
  );
}

function MobileNavigation({ pathname }) {
  const isExplorer = ["/", "/athletes", "/teams", "/organisations"].some((path) =>
    pathname.startsWith(path)
  );

  return (
    <footer className="fixed bottom-5 left-2.5 right-2.5 mx-auto w-auto max-w-[560px] rounded-full border border-border bg-background/90 py-3 shadow-xl backdrop-blur md:hidden">
      <div className="flex w-full justify-between px-6 text-xs font-medium text-muted-foreground">
        <NavLink href="/explore" label="Explorer" icon={Search} active={isExplorer} />
        <NavLink href="/followed" label="Suivis" icon={Heart} active={pathname.startsWith("/followed")} />
        <NavLink href="/collab" label="Collab" icon={Handshake} active={pathname.startsWith("/collab")} />
        <NavLink href="/messages" label="Messages" icon={MessageSquare} active={pathname.startsWith("/messages")} />
        <NavLink href="/settings" label="Profil" icon={User} active={pathname.startsWith("/settings")} />
      </div>
    </footer>
  );
}

function NavLink({ href, label, icon: Icon, active }) {
  return (
    <Link
      href={href}
      className={`flex max-w-[56px] flex-col items-center gap-1 transition ${
        active ? "text-foreground" : "opacity-70"
      }`}
    >
      <Icon className={`h-5 w-5 ${active ? "stroke-[2.5]" : ""}`} />
      <span className={`text-[0.625rem] ${active ? "font-semibold" : "font-medium"}`}>{label}</span>
    </Link>
  );
}

