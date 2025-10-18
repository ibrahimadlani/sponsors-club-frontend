"use client";

// Collaboration page: shows all contracts/collaborations for the user

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Heart,
  MessageSquare,
  Search,
  Handshake,
  User,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  Filter,
  Calendar,
  Building2,
} from "lucide-react";

import { SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getContracts } from "@/lib/api/contracts";
import { toast } from "sonner";

const STATUS_CONFIG = {
  draft: {
    label: "Brouillon",
    icon: FileText,
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  },
  negotiation: {
    label: "Négociation",
    icon: MessageSquare,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  },
  agreement: {
    label: "Accord",
    icon: Handshake,
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  },
  legal_review: {
    label: "Révision légale",
    icon: AlertCircle,
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  },
  signing: {
    label: "Signature",
    icon: FileText,
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  },
  active: {
    label: "Actif",
    icon: CheckCircle2,
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
  expired: {
    label: "Expiré",
    icon: Clock,
    color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  },
  terminated: {
    label: "Résilié",
    icon: XCircle,
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  },
};

const FILTER_OPTIONS = [
  { value: "all", label: "Tous" },
  { value: "draft", label: "Brouillons" },
  { value: "negotiation", label: "En négociation" },
  { value: "active", label: "Actifs" },
  { value: "signing", label: "En signature" },
];

export default function CollabPage() {
  const { user } = useCurrentUser();
  const router = useRouter();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const pathname = usePathname();
  const isExplorer = pathname === "/" || ["/explorer", "/athletes", "/teams", "/organisations"].some((p) => pathname.startsWith(p));

  // Load contracts
  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setLoading(true);
        const response = await getContracts();
        setContracts(response || []);
      } catch (error) {
        console.error("Error fetching contracts:", error);
        toast.error("Erreur lors du chargement des collaborations");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchContracts();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Filter contracts
  const filteredContracts = filter === "all" 
    ? contracts 
    : contracts.filter(c => c.status === filter);

  const handleCreateContract = () => {
    router.push("/collab/new");
  };

  return (
    <SidebarInset className="min-h-screen flex flex-col">
      <div className="max-w-6xl mx-auto px-4 py-6 w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Collaborations</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gérez vos contrats et partenariats
            </p>
          </div>
          <Button onClick={handleCreateContract} className="bg-pink-600 hover:bg-pink-700">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau contrat
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {FILTER_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant={filter === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(option.value)}
              className={filter === option.value ? "bg-pink-600 hover:bg-pink-700" : ""}
            >
              {option.label}
            </Button>
          ))}
        </div>

        {/* Contracts List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow border border-transparent animate-pulse"
              >
                <div className="flex items-start gap-4">
                  <div className="size-12 rounded-lg bg-muted shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-muted rounded w-2/3" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="flex gap-2">
                      <div className="h-6 w-24 bg-muted rounded" />
                      <div className="h-6 w-32 bg-muted rounded" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredContracts.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-10 text-center text-muted-foreground">
            <Handshake className="w-12 h-12 opacity-70 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2">
              {filter === "all" ? "Aucune collaboration" : "Aucun contrat dans cette catégorie"}
            </h3>
            <p className="text-sm mb-4">
              {filter === "all"
                ? "Commencez par créer votre premier contrat de partenariat."
                : "Essayez de changer le filtre pour voir d'autres contrats."}
            </p>
            {filter === "all" && (
              <Button onClick={handleCreateContract} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Créer un contrat
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredContracts.map((contract) => (
              <ContractCard key={contract.id} contract={contract} />
            ))}
          </div>
        )}
      </div>

      {/* Mobile sticky navigation/footer */}
      <footer className="fixed bottom-5 left-2.5 right-2.5 w-auto max-w-[560px] mx-auto py-3 bg-background text-center border-t md:hidden px-7 rounded-full shadow-xl">
        {user ? (
          <div className="flex justify-between w-full">
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

function ContractCard({ contract }) {
  const statusConfig = STATUS_CONFIG[contract.status] || STATUS_CONFIG.draft;
  const StatusIcon = statusConfig.icon;
  const router = useRouter();

  const formatDate = (dateString) => {
    if (!dateString) return "Non défini";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div
      onClick={() => router.push(`/collab/${contract.id}`)}
      className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow border border-transparent hover:border-gray-200 dark:hover:border-gray-800 transition-colors cursor-pointer"
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`size-12 rounded-lg flex items-center justify-center shrink-0 ${statusConfig.color}`}>
          <StatusIcon className="w-6 h-6" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className="text-lg font-semibold line-clamp-1">{contract.title}</h3>
            <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
          </div>

          {/* Organisation & Agent */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-3">
            {contract.organisation && (
              <div className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                <span>{contract.organisation.name}</span>
              </div>
            )}
            {contract.agent && (
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{contract.agent.name}</span>
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            {contract.effective_date && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Début: {formatDate(contract.effective_date)}</span>
              </div>
            )}
            {contract.expiration_date && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Fin: {formatDate(contract.expiration_date)}</span>
              </div>
            )}
            {contract.current_version_number > 1 && (
              <span className="text-xs">v{contract.current_version_number}</span>
            )}
          </div>

          {/* Agreement Status */}
          {(contract.owner_agreed_at || contract.agent_agreed_at) && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t">
              {contract.owner_agreed_at && (
                <Badge variant="outline" className="text-xs">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Organisation
                </Badge>
              )}
              {contract.agent_agreed_at && (
                <Badge variant="outline" className="text-xs">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Agent
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
