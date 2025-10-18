"use client";

// Followed page: shows a list of all athletes the user follows
// with options to view their profile or send them a message.

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Heart,
  MessageSquare,
  Search,
  Handshake,
  User,
} from "lucide-react";

import AthleteCard from "@/components/athlete-card";
import AthleteCardSkeleton from "@/components/athlete-card-skeleton";
import { SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getMyFollows } from "@/lib/api/users";
import { messaging } from "@/lib/api";
import { toast } from "sonner";

export default function FollowedFeedPage() {
  const { user } = useCurrentUser();
  const router = useRouter();
  const [athletes, setAthletes] = useState([]);
  const [loadingAthletes, setLoadingAthletes] = useState(true);
  const [messageLoadingId, setMessageLoadingId] = useState(null);
  const pathname = usePathname();
  const isExplorer = pathname === "/" || ["/explorer", "/athletes", "/teams", "/organisations"].some((p) => pathname.startsWith(p));

  // Load followed athletes
  useEffect(() => {
    const fetchFollowedAthletes = async () => {
      try {
        setLoadingAthletes(true);
        const response = await getMyFollows();
        // Extract athletes from the follow objects
        const athletesData = response?.map(follow => follow.athlete) || [];
        setAthletes(athletesData);
      } catch (error) {
        console.error("Error fetching followed athletes:", error);
        toast.error("Erreur lors du chargement des athlètes suivis");
      } finally {
        setLoadingAthletes(false);
      }
    };

    if (user) {
      fetchFollowedAthletes();
    } else {
      setLoadingAthletes(false);
    }
  }, [user]);

  const handleMessageClick = async (athlete) => {
    const agentId = athlete.agent?.id || athlete.agent_id || athlete.created_by;
    
    if (!agentId) {
      toast.error("Impossible de contacter cet athlète");
      return;
    }

    try {
      setMessageLoadingId(athlete.id);

      // Get all threads
      const threads = await messaging.getThreads();

      // Check if thread already exists with this agent
      const existingThread = threads.find(
        (thread) => thread.agent?.id === agentId
      );

      if (existingThread) {
        // Redirect to existing thread
        router.push(`/messages?thread=${existingThread.id}`);
      } else {
        // Create new thread
        const newThread = await messaging.createThread({
          agent_id: agentId,
          athlete_id: athlete.id,
        });

        // Redirect to new thread
        router.push(`/messages?thread=${newThread.id}`);
      }
    } catch (error) {
      console.error("Error handling message:", error);
      toast.error("Erreur lors de l'ouverture de la conversation");
    } finally {
      setMessageLoadingId(null);
    }
  };

  return (
    <SidebarInset className="min-h-screen flex flex-col">
      <div className="max-w-6xl mx-auto px-4 py-6 w-full">
          {/* Followed athletes list */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Athlètes suivis</h2>
              {!loadingAthletes && (
                <span className="text-sm text-muted-foreground">{athletes.length} athlète{athletes.length > 1 ? 's' : ''}</span>
              )}
            </div>
            {loadingAthletes ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <AthleteCardSkeleton key={i} />
                ))}
              </div>
            ) : athletes.length === 0 ? (
              <div className="bg-white dark:bg-zinc-900 rounded-xl p-10 text-center text-muted-foreground">
                <Heart className="w-10 h-10 opacity-70 mx-auto mb-2" />
                <p>Vous ne suivez encore aucun athlète.</p>
                <Link href="/athletes">
                  <Button variant="outline" className="mt-4">
                    Explorer les athlètes
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {athletes.map((athlete) => (
                  <AthleteCard
                    key={athlete.id}
                    athlete={athlete}
                    onMessageClick={handleMessageClick}
                    messageLoading={messageLoadingId === athlete.id}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Mobile sticky navigation/footer */}
        <footer
          className={"fixed bottom-5 left-2.5 right-2.5 w-auto max-w-[560px] mx-auto py-3 bg-background text-center border-t md:hidden px-7 rounded-full shadow-xl"}
        >
        {user ? (
          <div className="flex justify-between w-full">
            {/* Connecté: Explorer, Suivis, Collab, Messages, Profile */}
            <Link href="/explore" className={`flex flex-col items-center gap-0.5 font-medium antialiased w-full max-w-[56px] ${isExplorer ? 'text-pink-500' : 'opacity-70'}`}>
              <Search className="w-6 h-6" strokeWidth={isExplorer ? 2.5 : 1.5} />
              <span className={`text-[0.625rem] ${isExplorer ? 'font-bold' : 'font-medium'}`}>Explorer</span>
            </Link>
            <Link href="/followed" className={`flex flex-col items-center gap-0.5 font-medium antialiased w-full max-w-[56px] ${pathname.startsWith('/followed') ? 'text-pink-500' : 'opacity-70'}`}>
              <Heart className="w-6 h-6" strokeWidth={pathname.startsWith('/followed') ? 2.5 : 1.5} />
              <span className={`text-[0.625rem] ${pathname.startsWith('/followed') ? 'font-bold' : 'font-medium'}`}>Suivis</span>
            </Link>
            <Link href="/collab" className={`flex flex-col items-center gap-0.5 font-medium antialiased w-full max-w-[56px] ${pathname.startsWith('/collab') ? 'text-pink-500' : 'opacity-70'}`}>
              <Handshake className="w-6 h-6" strokeWidth={pathname.startsWith('/collab') ? 2.5 : 1.5} />
              <span className={`text-[0.625rem] ${pathname.startsWith('/collab') ? 'font-bold' : 'font-medium'}`}>Collab</span>
            </Link>
            <Link href="/messages" className={`flex flex-col items-center gap-0.5 font-medium antialiased w-full max-w-[56px] ${pathname.startsWith('/messages') ? 'text-pink-500' : 'opacity-70'}`}>
              <MessageSquare className="w-6 h-6" strokeWidth={pathname.startsWith('/messages') ? 2.5 : 1.5} />
              <span className={`text-[0.625rem] ${pathname.startsWith('/messages') ? 'font-bold' : 'font-medium'}`}>Messages</span>
            </Link>
            <Link href="/settings" className={`flex flex-col items-center gap-0.5 font-medium antialiased w-full max-w-[56px] ${pathname.startsWith('/settings') ? 'text-pink-500' : 'opacity-70'}`}>
              <User className="w-6 h-6" strokeWidth={pathname.startsWith('/settings') ? 2.5 : 1.5} />
              <span className={`text-[0.625rem] ${pathname.startsWith('/settings') ? 'font-bold' : 'font-medium'}`}>Profile</span>
            </Link>
          </div>
        ) : (
          <div className="flex justify-center gap-6 w-full">
            {/* Déconnecté: Explorer, Suivis, Connexion */}
            <Link href="/explorer" className={`flex flex-col items-center gap-0.5 font-medium w-full max-w-[56px] ${isExplorer ? 'text-pink-500' : 'opacity-70'}`}>
              <Search className="w-6 h-6" strokeWidth={isExplorer ? 2.5 : 1.5} />
              <span className={`text-[0.625rem] ${isExplorer ? 'font-bold' : 'font-medium'}`}>Explorer</span>
            </Link>
            <Link href="/followed" className={`flex flex-col items-center gap-0.5 font-medium w-full max-w-[56px] ${pathname.startsWith('/followed') ? 'text-pink-500' : 'opacity-70'}`}>
              <Heart className="w-6 h-6" strokeWidth={pathname.startsWith('/followed') ? 2.5 : 1.5} />
              <span className={`text-[0.625rem] ${pathname.startsWith('/followed') ? 'font-bold' : 'font-medium'}`}>Suivis</span>
            </Link>
            <Link href="/login" className={`flex flex-col items-center gap-0.5 font-medium w-full max-w-[56px] ${pathname.startsWith('/login') ? 'text-pink-500' : 'opacity-70'}`}>
              <User className="w-6 h-6" strokeWidth={pathname.startsWith('/login') ? 2.5 : 1.5} />
              <span className={`text-[0.625rem] ${pathname.startsWith('/login') ? 'font-bold' : 'font-medium'}`}>Connexion</span>
            </Link>
          </div>
        )}
      </footer>
    </SidebarInset>
  );
}
