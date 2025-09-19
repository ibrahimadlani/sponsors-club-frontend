"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowUp, Check, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SUGGESTED_USERS = [
  {
    name: "Olivia Martin",
    email: "olivia.martin@example.com",
    avatar: "/avatars/01.png",
  },
  {
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    avatar: "/avatars/03.png",
  },
  {
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    avatar: "/avatars/05.png",
  },
  {
    name: "Jackson Lee",
    email: "jackson.lee@example.com",
    avatar: "/avatars/02.png",
  },
  {
    name: "William Kim",
    email: "william.kim@email.com",
    avatar: "/avatars/04.png",
  },
];

export function CardsChat({
  conversation,
  messages,
  onSendMessage,
  onStartConversation,
  suggestions = SUGGESTED_USERS,
  showBackButton = false,
  onBack,
}) {
  const [open, setOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  const inputLength = input.trim().length;

  const displayName = conversation?.name ?? "Conversation";
  const displayEmail = conversation?.email ?? "";
  const displayAvatar = conversation?.avatar ?? "/avatars/01.png";

  const isSendDisabled = inputLength === 0 || !conversation;

  const selectableUsers = useMemo(() => {
    if (!conversation) return suggestions;
    return suggestions.filter((user) => user.email !== conversation.email);
  }, [conversation, suggestions]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isSendDisabled) return;
    onSendMessage?.(trimmed);
    setInput("");
  };

  const toggleUser = (user) => {
    setSelectedUsers((prev) => {
      const exists = prev.find((item) => item.email === user.email);
      if (exists) {
        return prev.filter((item) => item.email !== user.email);
      }
      return [...prev, user];
    });
  };

  const handleContinue = () => {
    if (selectedUsers.length === 0) return;
    onStartConversation?.(selectedUsers);
    setSelectedUsers([]);
    setOpen(false);
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const behavior = container.scrollTop > 0 ? "smooth" : "auto";
    container.scrollTo({ top: container.scrollHeight, behavior });
  }, [conversation, messages]);

  return (
    <>
      <Card className="flex h-full max-h-full flex-col">
        <CardHeader className="flex flex-row items-center gap-4">
          {showBackButton && conversation ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="mr-1 size-8 rounded-full lg:hidden"
              onClick={() => onBack?.()}
            >
              <ArrowLeft className="size-4" />
              <span className="sr-only">Revenir aux conversations</span>
            </Button>
          ) : null}
          <div className="flex flex-1 items-center gap-4">
            <Avatar className="border">
              <AvatarImage src={displayAvatar} alt={displayName} />
              <AvatarFallback>
                {displayName
                  .split(" ")
                  .map((chunk) => chunk.charAt(0))
                  .join("") || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-medium leading-none">{displayName}</p>
              {displayEmail && (
                <p className="text-xs text-muted-foreground">{displayEmail}</p>
              )}
            </div>
          </div>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="secondary"
                  className="ml-auto size-8 rounded-full"
                  onClick={() => setOpen(true)}
                >
                  <Plus className="size-4" />
                  <span className="sr-only">Nouveau message</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent sideOffset={10}>Nouveau message</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardHeader>
        <CardContent ref={scrollRef} className="flex-1 overflow-y-auto">
          {messages?.length ? (
            <div className="flex flex-col gap-4">
              {messages.map((message) => (
                <div
                  key={message.id || message.content}
                  className={cn(
                    "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                    message.from === "me"
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {message.text || message.content}
                  {message.time && (
                    <span className="text-[10px] opacity-70">
                      {message.time}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
              <p className="font-medium">Aucun message pour le moment</p>
              <p>Commencez la conversation en envoyant un message.</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <form onSubmit={handleSubmit} className="relative w-full">
            <Input
              id="message"
              placeholder={conversation ? "Écrire votre message..." : "Sélectionnez une conversation"}
              className="flex-1 pr-10"
              autoComplete="off"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              disabled={!conversation}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-2 top-1/2 size-6 -translate-y-1/2 rounded-full"
              disabled={isSendDisabled}
            >
              <ArrowUp className="size-3.5" />
              <span className="sr-only">Envoyer</span>
            </Button>
          </form>
        </CardFooter>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="gap-0 p-0 outline-none">
          <DialogHeader className="px-4 pb-4 pt-5">
            <DialogTitle>Nouveau message</DialogTitle>
            <DialogDescription>
              Invitez un ou plusieurs contacts à cette conversation.
            </DialogDescription>
          </DialogHeader>
          <Command className="overflow-hidden rounded-t-none border-t bg-transparent">
            <CommandInput placeholder="Rechercher un contact..." />
            <CommandList>
              <CommandEmpty>Aucun résultat.</CommandEmpty>
              <CommandGroup>
                {selectableUsers.map((user) => {
                  const isActive = selectedUsers.some(
                    (item) => item.email === user.email
                  );
                  return (
                    <CommandItem
                      key={user.email}
                      data-active={isActive}
                      className="data-[active=true]:opacity-50"
                      onSelect={() => toggleUser(user)}
                    >
                      <Avatar className="border">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="ml-2">
                        <p className="text-sm font-medium leading-none">
                          {user.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                      {isActive ? (
                        <Check className="ml-auto flex size-4 text-primary" />
                      ) : null}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
          <DialogFooter className="flex items-center justify-between border-t p-4">
            {selectedUsers.length ? (
              <div className="flex -space-x-2 overflow-hidden">
                {selectedUsers.map((user) => (
                  <Avatar key={user.email} className="inline-block border">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Sélectionnez des contacts à ajouter.
              </p>
            )}
            <Button size="sm" disabled={selectedUsers.length === 0} onClick={handleContinue}>
              Continuer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CardsChat;
