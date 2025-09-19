"use client";

// Messages page rebuilt around the shadcn CardsChat component.
// Responsive: chat card stacks on small screens and sits beside the conversation list on desktop.

import { useContext, useEffect, useMemo, useState } from "react";
import { MessageSquare } from "lucide-react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import PageHeader from "@/components/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import AuthContext from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { CardsChat } from "@/components/cards-chat";
import { cn } from "@/lib/utils";

const sampleConversations = [
  {
    id: 1,
    name: "Teddy Riner",
    email: "teddy.riner@sponsorsclub.fr",
    avatar: "/images/teddy-1.jpg",
    lastMessage: "On se parle demain ?",
    unread: 2,
  },
  {
    id: 2,
    name: "Clarisse Agbegnenou",
    email: "clarisse.ag@sponsorsclub.fr",
    avatar: "/images/clarisse-1.jpg",
    lastMessage: "Merci !",
    unread: 0,
  },
  {
    id: 3,
    name: "Victor Wembanyama",
    email: "victor.w@sponsorsclub.fr",
    avatar: "/images/wemby-1.jpg",
    lastMessage: "Ok pour vendredi",
    unread: 1,
  },
  {
    id: 4,
    name: "Caroline Garcia",
    email: "caroline.g@sponsorsclub.fr",
    avatar: "/images/garcia-1.jpg",
    lastMessage: "À bientôt",
    unread: 0,
  },
];

const initialMessages = {
  1: [
    { id: 101, from: "them", text: "Salut !", time: "10:21" },
    { id: 102, from: "me", text: "Hello Teddy, dispo demain ?", time: "10:22" },
    { id: 103, from: "them", text: "Oui, parfait.", time: "10:24" },
  ],
  2: [
    { id: 201, from: "me", text: "Félicitations pour la victoire !", time: "09:05" },
    { id: 202, from: "them", text: "Merci !", time: "09:08" },
  ],
  3: [
    { id: 301, from: "them", text: "Ok pour vendredi", time: "11:12" },
  ],
  4: [],
};

export default function MessagesPage() {
  const { user, isAuthenticating } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticating && !user) {
      toast.error("Vous devez être connecté pour accéder à cette page.");
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticating, user, router, pathname]);

  const [conversations, setConversations] = useState(sampleConversations);
  const [selectedId, setSelectedId] = useState(sampleConversations[0]?.id ?? null);
  const [messagesByConv, setMessagesByConv] = useState(initialMessages);
  const [search, setSearch] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [activePanel, setActivePanel] = useState("list");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const update = (event) => setIsMobile(event.matches);
    update(mediaQuery);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", update);
    } else {
      mediaQuery.addListener(update);
    }
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", update);
      } else {
        mediaQuery.removeListener(update);
      }
    };
  }, []);

  useEffect(() => {
    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === selectedId
          ? { ...conversation, unread: 0 }
          : conversation
      )
    );
  }, [selectedId]);

  useEffect(() => {
    if (!isMobile) {
      setActivePanel("list");
      return;
    }
    if (!selectedId) {
      setActivePanel("list");
    }
  }, [isMobile, selectedId]);

  const selectedConv = useMemo(
    () => conversations.find((conversation) => conversation.id === selectedId) || null,
    [conversations, selectedId]
  );

  const filteredConversations = useMemo(() => {
    if (!search.trim()) return conversations;
    const query = search.toLowerCase();
    return conversations.filter(
      (conversation) =>
        conversation.name.toLowerCase().includes(query) ||
        conversation.email?.toLowerCase().includes(query)
    );
  }, [conversations, search]);

  const messages = messagesByConv[selectedId] || [];

  const sendMessage = (text) => {
    if (!text || !selectedId) return;
    const newMsg = {
      id: Date.now(),
      from: "me",
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessagesByConv((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] || []), newMsg],
    }));
  };

  const handleBackToList = () => setActivePanel("list");

  const ConversationList = ({ contentClassName = "" }) => (
    <Card className="flex h-full max-h-full flex-col">
      <CardHeader className="space-y-4 pb-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-semibold">Conversations</h2>
          <span className="text-xs text-muted-foreground">
            {conversations.length}
          </span>
        </div>
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher un contact"
          className="h-9"
        />
      </CardHeader>
      <CardContent className={cn("flex-1 space-y-3 overflow-y-auto pb-6", contentClassName)}>
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-muted-foreground">
            <MessageSquare className="h-10 w-10 opacity-70" />
            <p className="text-sm font-medium">Aucune conversation trouvée</p>
            <p className="text-xs">Lancez un nouveau message depuis la carte ci-contre.</p>
          </div>
        ) : (
          filteredConversations.map((conversation) => {
            const isActive = conversation.id === selectedId;
            return (
              <button
                key={conversation.id}
                type="button"
                onClick={() => {
                  setSelectedId(conversation.id);
                  if (isMobile) {
                    requestAnimationFrame(() => setActivePanel("chat"));
                  }
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2 text-left transition",
                  isActive ? "border-primary/40 bg-primary/5" : "hover:bg-muted"
                )}
              >
                <div className="relative">
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src={conversation.avatar} alt={conversation.name} />
                    <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {conversation.unread > 0 && (
                    <span className="absolute -right-1 -top-1 rounded-full bg-pink-600 px-1.5 text-[10px] font-medium text-white">
                      {conversation.unread}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{conversation.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {conversation.lastMessage}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </CardContent>
    </Card>
  );

  const handleStartConversation = (selectedUsers) => {
    if (!selectedUsers?.length) return;

    let nextConversationId = null;
    setConversations((prev) => {
      const existingEmails = new Set(prev.map((conversation) => conversation.email));
      const newItems = [];

      selectedUsers.forEach((user) => {
        const existing = prev.find((conversation) => conversation.email === user.email);
        if (existing && !nextConversationId) {
          nextConversationId = existing.id;
          return;
        }

        if (!existingEmails.has(user.email)) {
          const newConversation = {
            id: Date.now() + Math.floor(Math.random() * 1000),
            name: user.name,
            email: user.email,
            avatar: user.avatar || "/avatars/01.png",
            lastMessage: "Nouvelle conversation",
            unread: 0,
          };
          newItems.push(newConversation);
          existingEmails.add(user.email);
          if (!nextConversationId) {
            nextConversationId = newConversation.id;
          }
        }
      });

      if (newItems.length) {
        setMessagesByConv((prevMessages) => {
          const next = { ...prevMessages };
          newItems.forEach((conversation) => {
            next[conversation.id] = [];
          });
          return next;
        });
      }

      if (nextConversationId) {
        setSelectedId(nextConversationId);
      }

      if (!newItems.length) {
        return prev;
      }

      return [...newItems, ...prev];
    });

    if (isMobile && nextConversationId) {
      setActivePanel("chat");
    }
  };

  if (isAuthenticating) return null;
  if (!user) return null;

  const hideHeader = isMobile && activePanel === "chat";

  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    if (isMobile && activePanel === "chat") {
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previous;
      };
    }

    document.body.style.overflow = "";
    return undefined;
  }, [isMobile, activePanel]);

  return (
    <SidebarProvider>
      <SidebarInset className="min-h-screen flex flex-col">
        <PageHeader
          user={user}
          className={cn(
            "transition-all duration-300 ease-in-out",
            hideHeader
              ? "-translate-y-full opacity-0 pointer-events-none"
              : "translate-y-0 opacity-100"
          )}
        />

        <div className="mx-auto flex w-full max-w-6xl flex-1 py-6">
          <div className="relative w-full min-h-[calc(100vh-180px)] lg:hidden">
            <div
              className={cn(
                "absolute inset-0 transition-transform duration-300 ease-in-out",
                activePanel === "chat" ? "-translate-x-full" : "translate-x-0"
              )}
            >
              <div className="flex h-full flex-col px-4">
                <ConversationList contentClassName="flex-1" />
              </div>
            </div>
            <div
              className={cn(
                "absolute inset-0 transition-transform duration-300 ease-in-out",
                activePanel === "chat" ? "translate-x-0" : "translate-x-full"
              )}
            >
              <div className="flex h-full flex-col px-4">
                <CardsChat
                  conversation={selectedConv}
                  messages={messages}
                  onSendMessage={sendMessage}
                  onStartConversation={handleStartConversation}
                  showBackButton
                  onBack={handleBackToList}
                />
              </div>
            </div>
          </div>

          <div className="hidden w-full gap-6 px-4 lg:grid lg:grid-cols-[280px,1fr]">
            <ConversationList contentClassName="lg:max-h-[520px]" />
            <CardsChat
              conversation={selectedConv}
              messages={messages}
              onSendMessage={sendMessage}
              onStartConversation={handleStartConversation}
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
