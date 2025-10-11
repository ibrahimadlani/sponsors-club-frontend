"use client";

/**
 * Collaborations Page
 * 
 * Displays a list of active and past collaborations/contracts.
 * Shows contract details, status, and allows users to manage their collaborations.
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FileText, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Plus,
  Search,
  Filter
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * Get status badge variant
 */
const getStatusVariant = (status) => {
  switch (status?.toLowerCase()) {
    case "active":
    case "signed":
      return "default";
    case "pending":
    case "draft":
      return "secondary";
    case "expired":
    case "terminated":
      return "destructive";
    default:
      return "outline";
  }
};

/**
 * Get status icon
 */
const getStatusIcon = (status) => {
  switch (status?.toLowerCase()) {
    case "active":
    case "signed":
      return <CheckCircle2 className="h-4 w-4" />;
    case "pending":
    case "draft":
      return <Clock className="h-4 w-4" />;
    case "expired":
    case "terminated":
      return <AlertCircle className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

/**
 * Format date
 */
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
};

/**
 * Format currency
 */
const formatCurrency = (amount, currency = "EUR") => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
  }).format(amount);
};

/**
 * Collaboration Card Component
 */
function CollaborationCard({ collaboration }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              {collaboration.title || `Contrat #${collaboration.id}`}
            </CardTitle>
            <CardDescription className="mt-1">
              {collaboration.organisation?.name || "Organisation"}
            </CardDescription>
          </div>
          <Badge variant={getStatusVariant(collaboration.status)}>
            <span className="flex items-center gap-1">
              {getStatusIcon(collaboration.status)}
              {collaboration.status || "Draft"}
            </span>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {/* Athlete */}
          {collaboration.athlete && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Athlète:</span>
              <span className="font-medium">
                {collaboration.athlete.full_name || collaboration.athlete.name}
              </span>
            </div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Calendar className="h-4 w-4" />
                Début
              </div>
              <div className="font-medium">
                {formatDate(collaboration.start_date)}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Calendar className="h-4 w-4" />
                Fin
              </div>
              <div className="font-medium">
                {formatDate(collaboration.end_date)}
              </div>
            </div>
          </div>

          {/* Amount */}
          {collaboration.amount && (
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold text-lg">
                {formatCurrency(collaboration.amount)}
              </span>
            </div>
          )}

          {/* Description */}
          {collaboration.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {collaboration.description}
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button asChild variant="default" className="flex-1">
          <Link href={`/collaborations/${collaboration.id}`}>
            Voir les détails
          </Link>
        </Button>
        {collaboration.status === "pending" && (
          <Button variant="outline">
            Signer
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

/**
 * Main Collaborations Page
 */
export default function CollaborationsPage() {
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  // Mock data (à remplacer par un vrai appel API)
  useEffect(() => {
    const fetchCollaborations = async () => {
      setLoading(true);
      try {
        // TODO: Remplacer par contractEndpoints.list()
        // const data = await contractEndpoints.list();
        
        // Mock data pour démonstration
        const mockData = [
          {
            id: 1,
            title: "Campagne Nike Running 2025",
            organisation: { name: "Nike France" },
            athlete: { name: "Léon Marchand", full_name: "Léon Marchand" },
            status: "active",
            start_date: "2025-01-01",
            end_date: "2025-12-31",
            amount: 50000,
            description: "Campagne de promotion pour la nouvelle gamme de chaussures de running Nike."
          },
          {
            id: 2,
            title: "Sponsoring Adidas",
            organisation: { name: "Adidas France" },
            athlete: { name: "Teddy Riner", full_name: "Teddy Riner" },
            status: "pending",
            start_date: "2025-03-01",
            end_date: "2026-03-01",
            amount: 75000,
            description: "Contrat de sponsoring avec apparitions publiques et posts sur réseaux sociaux."
          },
          {
            id: 3,
            title: "Collaboration Red Bull",
            organisation: { name: "Red Bull" },
            athlete: { name: "Perrine Laffont", full_name: "Perrine Laffont" },
            status: "signed",
            start_date: "2024-10-01",
            end_date: "2025-10-01",
            amount: 40000,
            description: "Partenariat pour événements sportifs et contenus digitaux."
          },
          {
            id: 4,
            title: "Partenariat Décathlon",
            organisation: { name: "Décathlon" },
            athlete: { name: "Kevin Mayer", full_name: "Kevin Mayer" },
            status: "expired",
            start_date: "2024-01-01",
            end_date: "2024-12-31",
            amount: 30000,
            description: "Ambassadeur de la marque pour l'année 2024."
          },
        ];

        setCollaborations(mockData);
      } catch (error) {
        console.error("Erreur lors du chargement des collaborations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollaborations();
  }, []);

  // Filter collaborations
  const filteredCollaborations = collaborations.filter((collab) => {
    // Search filter
    const matchesSearch =
      searchTerm === "" ||
      collab.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collab.organisation?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collab.athlete?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus =
      statusFilter === "all" ||
      collab.status?.toLowerCase() === statusFilter.toLowerCase();

    // Tab filter
    let matchesTab = true;
    if (activeTab === "active") {
      matchesTab = collab.status?.toLowerCase() === "active" || collab.status?.toLowerCase() === "signed";
    } else if (activeTab === "pending") {
      matchesTab = collab.status?.toLowerCase() === "pending" || collab.status?.toLowerCase() === "draft";
    } else if (activeTab === "completed") {
      matchesTab = collab.status?.toLowerCase() === "expired" || collab.status?.toLowerCase() === "terminated";
    }

    return matchesSearch && matchesStatus && matchesTab;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Collaborations</h1>
          <p className="text-muted-foreground mt-2">
            Gérez vos contrats et partenariats
          </p>
        </div>
        <Button asChild className="mt-4 md:mt-0">
          <Link href="/collaborations/new">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle collaboration
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une collaboration..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="active">Actif</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="signed">Signé</SelectItem>
            <SelectItem value="expired">Expiré</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">
            Toutes ({collaborations.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Actives ({collaborations.filter(c => ["active", "signed"].includes(c.status?.toLowerCase())).length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            En attente ({collaborations.filter(c => ["pending", "draft"].includes(c.status?.toLowerCase())).length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Terminées ({collaborations.filter(c => ["expired", "terminated"].includes(c.status?.toLowerCase())).length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement des collaborations...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredCollaborations.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucune collaboration trouvée</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || statusFilter !== "all"
              ? "Essayez de modifier vos filtres"
              : "Commencez par créer votre première collaboration"}
          </p>
          {!searchTerm && statusFilter === "all" && (
            <Button asChild>
              <Link href="/collaborations/new">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle collaboration
              </Link>
            </Button>
          )}
        </div>
      )}

      {/* Collaborations Grid */}
      {!loading && filteredCollaborations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCollaborations.map((collaboration) => (
            <CollaborationCard
              key={collaboration.id}
              collaboration={collaboration}
            />
          ))}
        </div>
      )}
    </div>
  );
}
